import Nishan from "../dist/Nishan";
import data from "./data";

const nishan = new Nishan({
  token: "",
  logger: false
});

nishan.init_cache = true;

nishan.saveToCache(data.recordMap)

const USER_ONE_ID = "d94caf87-a207-45c3-b3d5-03d157b5b39b",
SPACE_ONE_ID = "d2498a62-99ed-4ffd-b56d-e986001729f4";

export {
  USER_ONE_ID,
  SPACE_ONE_ID,
  nishan
}