import { Chapter2 } from "./Chapter2";
import { Chapter3 } from "./Chapter3";
import { Chapter4_1 } from "./Chapter4_1";
import { Chapter4_2 } from "./Chapter4_2";
import { Chapter5 } from "./Chapter5";
import { Chapter6 } from "./Chapter6";

export interface Form {
  id: number;
  chapter2: Chapter2;
  chapter3: Chapter3;
  chapter4_1: Chapter4_1;
  chapter4_2: Chapter4_2;
  chapter5: Chapter5;
  chapter6: Chapter6;
  documented_at: string;
}