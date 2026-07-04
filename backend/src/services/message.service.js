import logger from "../config/logger.js";
import { getPaginationParams, getSortParams, buildPaginationMeta } from "../utils/pagination.js";
import { NotFoundError } from "../errors/index.js";
import * as messageRepository from "../repositories/message.repository.js";

export async function create(data) {
  const message = await messageRepository.create({
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
  });

  logger.info({ messageId: message.id, email: message.email }, "New contact message received");

  return message;
}

export async function getAllAdmin(query) {
  const { page, limit, skip } = getPaginationParams(query);
  const { search, isRead, isArchived, isReplied } = query;

  const where = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { subject: { contains: search, mode: "insensitive" } },
      { message: { contains: search, mode: "insensitive" } },
    ];
  }

  if (isRead !== undefined) {
    where.isRead = isRead === "true";
  }

  if (isArchived !== undefined) {
    where.isArchived = isArchived === "true";
  }

  if (isReplied !== undefined) {
    where.isReplied = isReplied === "true";
  }

  const orderBy = getSortParams(query, ["createdAt", "updatedAt", "name", "email", "subject"]);
  const [messages, total] = await Promise.all([
    messageRepository.findAll({ where, orderBy, skip, take: limit }),
    messageRepository.count(where),
  ]);

  return {
    data: messages,
    pagination: buildPaginationMeta(total, page, limit),
  };
}

export async function getById(id) {
  const message = await messageRepository.findById(id);
  if (!message) {
    throw new NotFoundError("Message not found");
  }
  return message;
}

export async function markRead(id, isRead) {
  const existing = await messageRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Message not found");
  }

  return messageRepository.update(id, { isRead });
}

export async function archive(id, isArchived) {
  const existing = await messageRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Message not found");
  }

  return messageRepository.update(id, { isArchived });
}

export async function reply(id, replyMessage, adminName) {
  const existing = await messageRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Message not found");
  }

  const message = await messageRepository.update(id, {
    isReplied: true,
    repliedAt: new Date(),
    repliedBy: adminName,
    replyMessage,
  });

  logger.info({ messageId: id }, "Message replied");

  return message;
}

export async function update(id, data) {
  const existing = await messageRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Message not found");
  }

  const allowed = {};
  if (data.name !== undefined) allowed.name = data.name;
  if (data.email !== undefined) allowed.email = data.email;
  if (data.subject !== undefined) allowed.subject = data.subject;
  if (data.message !== undefined) allowed.message = data.message;

  return messageRepository.update(id, allowed);
}

export async function deleteMessage(id) {
  const existing = await messageRepository.findById(id);
  if (!existing) {
    throw new NotFoundError("Message not found");
  }

  await messageRepository.deleteMessage(id);

  logger.info({ messageId: id }, "Message deleted");
}

export async function getStats() {
  const [total, unread, read, archived, replied, unreplied] = await Promise.all([
    messageRepository.count({}),
    messageRepository.count({ isRead: false }),
    messageRepository.count({ isRead: true }),
    messageRepository.count({ isArchived: true }),
    messageRepository.count({ isReplied: true }),
    messageRepository.count({ isReplied: false }),
  ]);

  return {
    total,
    unread,
    read,
    archived,
    replied,
    unreplied,
  };
}

export async function exportCSV(query) {
  const where = {};

  if (query.isRead !== undefined) {
    where.isRead = query.isRead === "true";
  }

  if (query.isArchived !== undefined) {
    where.isArchived = query.isArchived === "true";
  }

  const messages = await messageRepository.findAllForExport({
    where,
    orderBy: { createdAt: "desc" },
  });

  const header = "ID,Name,Email,Subject,Message,Is Read,Is Archived,Is Replied,Created At\n";
  const rows = messages
    .map((m) => {
      const escapedMessage = `"${(m.message || "").replace(/"/g, '""')}"`;
      return [
        m.id,
        `"${m.name}"`,
        m.email,
        `"${m.subject}"`,
        escapedMessage,
        m.isRead ? "Yes" : "No",
        m.isArchived ? "Yes" : "No",
        m.isReplied ? "Yes" : "No",
        m.createdAt.toISOString(),
      ].join(",");
    })
    .join("\n");

  return `${header}${rows}`;
}
