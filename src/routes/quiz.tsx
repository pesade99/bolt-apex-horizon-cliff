import { createFileRoute } from "@tanstack/react-router";
import { QuizApp } from "@/components/quiz-app";

export const Route = createFileRoute("/quiz")({ component: QuizApp });
