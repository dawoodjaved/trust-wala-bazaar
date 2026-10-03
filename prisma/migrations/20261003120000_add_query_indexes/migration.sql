-- Performance indexes for hot list/search/chat paths
CREATE INDEX IF NOT EXISTS "User_city_idx" ON "User"("city");

CREATE INDEX IF NOT EXISTS "Product_isActive_trustScore_idx" ON "Product"("isActive", "trustScore");
CREATE INDEX IF NOT EXISTS "Product_isActive_createdAt_idx" ON "Product"("isActive", "createdAt");
CREATE INDEX IF NOT EXISTS "Product_categoryId_isActive_idx" ON "Product"("categoryId", "isActive");
CREATE INDEX IF NOT EXISTS "Product_sellerId_isActive_idx" ON "Product"("sellerId", "isActive");
CREATE INDEX IF NOT EXISTS "Product_city_idx" ON "Product"("city");

CREATE INDEX IF NOT EXISTS "Review_productId_createdAt_idx" ON "Review"("productId", "createdAt");
CREATE INDEX IF NOT EXISTS "Review_userId_idx" ON "Review"("userId");

CREATE INDEX IF NOT EXISTS "Message_conversationId_createdAt_idx" ON "Message"("conversationId", "createdAt");
CREATE INDEX IF NOT EXISTS "Message_senderId_receiverId_idx" ON "Message"("senderId", "receiverId");
CREATE INDEX IF NOT EXISTS "Message_receiverId_isRead_idx" ON "Message"("receiverId", "isRead");
