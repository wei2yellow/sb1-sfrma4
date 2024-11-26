// ... existing imports and tables ...

// 應對情況表
export const serviceSituations = sqliteTable('service_situations', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(), // 'customer' | 'service' | 'emergency' | 'other'
  priority: text('priority').notNull(), // 'high' | 'medium' | 'low'
  createdBy: text('created_by').notNull().references(() => users.id),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at'),
  isActive: integer('is_active').default(1),
});

// 應對方法表
export const serviceResponses = sqliteTable('service_responses', {
  id: text('id').primaryKey(),
  situationId: text('situation_id').notNull().references(() => serviceSituations.id),
  content: text('content').notNull(),
  order: integer('order').notNull(),
  createdBy: text('created_by').notNull().references(() => users.id),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at'),
  isActive: integer('is_active').default(1),
});