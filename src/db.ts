import Dexie, { type Table } from "dexie";
import type { Exam } from "./types";

class ExamDB extends Dexie {
  exams!: Table<Exam, number>;
  constructor() {
    super("teacher-exam-pwa");
    this.version(1).stores({ exams: "++id, updatedAt, title" });
  }
}
export const db = new ExamDB();