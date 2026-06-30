import { z } from "zod";

export const entryTextSchema = z.string().trim().min(1);