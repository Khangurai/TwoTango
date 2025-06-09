import { ExpenseManager } from "./expense.js";
import { MapManager } from "./map.js";
import { MusicPlayer } from "./music.js";

document.addEventListener("DOMContentLoaded", () => {
  new ExpenseManager();
  new MapManager();
  new MusicPlayer();
});
