
import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from "./middleware";
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import cors from "cors";
import bcrypt from "bcrypt"

const app = express();
app.use(express.json());
app.use(cors())

app.post("/signup", async (req, res) => {

    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        return res.json({
            message: "Incorrect inputs"
        })
        
    }
    try {
        const hashedPassword = await bcrypt.hash(parsedData.data.password,6);
        const user = await prismaClient.user.create({
            data: {
                email: parsedData.data?.username,
                // TODO: Hash the pw
                password: hashedPassword,
                name: parsedData.data.name
            }
        })
        const token = jwt.sign({
            userId: user.id
        },JWT_SECRET)
        res.json({
            token
        })
    } catch(e) {
        res.status(411).json({
            message: "User already exists with this username"
        })
    }
})

app.post("/signin", async (req, res) => {
    
    const parsedData = SigninSchema.safeParse(req.body);
    
    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    // TODO: Compare the hashed pws here
    
    const user = await prismaClient.user.findFirst(
        {
        where: {
            email: parsedData.data.username
        }
    })

    if (!user) {
        res.status(403).json({
            message: "Incorrect email or password"
        })
        return;
    }
    const comparePassword = await bcrypt.compare(parsedData.data.password, user?.password)
    if(!comparePassword){
        res.status(403).json({
            message : "Incorrect email or password"
        })
        return;
    }

    const token = jwt.sign({
        userId: user?.id
    }, JWT_SECRET);

    res.json({
        token
    })
})

app.post("/room", middleware, async (req, res) => {
  const parsed = CreateRoomSchema.safeParse(req.body);
  if (!parsed.success) return res.json({ message: "Incorrect inputs" });

  const userId = req.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const slug = String(Math.floor(1000 + Math.random() * 9000));
  try {
    const room = await prismaClient.room.create({
      data: {
        slug,
        adminId: userId
      }
    });
    return res.json({ roomId: room.slug });
  } catch (e) {
    return res.status(411).json({ message: "Room create failed" });
  }
});

app.get("/my-rooms", middleware, async (req, res) => {
  const userId = req.userId;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const rooms = await prismaClient.room.findMany({
    where: { adminId: userId },
    select: { slug: true, createdAt: true }
  });
  res.json({ rooms });
});

app.get("/chats/:roomId", async (req, res) => {
  const slug = req.params.roomId;
  const room = await prismaClient.room.findUnique({ where: { slug } });
  if (!room) return res.json({ messages: [] });
  const messages = await prismaClient.chat.findMany({
    where: { roomId: room.id },
    orderBy: { id: "desc" },
    take: 1000
  });
  res.json({ messages });
});

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    })
})

app.listen(3004);
