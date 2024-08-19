import { openDB } from "idb";

const db = await openDB("pills-taken", 1, {
  upgrade(db) {
    db.createObjectStore("day-pill-taken", {
    });
  },
});

export const getDatesPillTaken = async () => {
  try {
    return await db.getAll("day-pill-taken");
  } catch (error) {
    console.error("🚀 ~ getDatesPillTaken ~ error:", error);
  }
};

export const createDatePillTaken = async (date, key) => {
  try {
    console.log(key)
    return await db.put("day-pill-taken", date, key)
  } catch (error) {
    console.error("🚀 ~ setDatePillTaken ~ error:", error);
  }
};

export const deleteDatePillTaken = async (id) => {
  console.log("🚀 ~ deleteDatePillTaken ~ id:", id)
  try {
    
    const result =  await db.delete("day-pill-taken", id)
    console.log("🚀 ~ deleteDatePillTaken ~ reslut:", result)
  } catch (error) {
    console.error("🚀 ~ deleteDatePillTaken ~ error:", error)
    
  }
}