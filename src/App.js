import { useEffect, useState } from "react";
import {
  createDatePillTaken,
  deleteDatePillTaken,
  getDatesPillTaken,
} from "./config/database.config";

function App() {
  const numDays = (y, m) => new Date(y, m + 1, 0).getDate();

  const [dayPillTaken, setDayPillTaken] = useState([]);
  const [date, setDate] = useState(new Date());
  const [nbDays, setNbDays] = useState(
    numDays(date.getFullYear(), date.getMonth())
  );

  const nextMonth = () => {
    //afficher le mois suivant
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);
    setDate(newDate);
    setNbDays(numDays(newDate.getFullYear(), newDate.getMonth()));
  };

  const previousMonth = () => {
    //afficher le mois d'avant
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - 1);
    setDate(newDate);
    //calcul du nombre de jour dans le mois
    setNbDays(numDays(newDate.getFullYear(), newDate.getMonth()));
  };

  const pillsTaken = async (day) => {
    // Changement de bg + delete de la bdd si le jour était déjà sélectionné
    if (dayPillTaken.includes(day)) {
      try {
        await deleteDatePillTaken(
          `${day}/${date.getMonth() + 1}/${date.getFullYear()}`
        );
        setDayPillTaken((previousDay) => previousDay.filter((d) => d !== day));
        return;
      } catch (error) {
        console.error("🚀 ~ pillsTaken ~ error:", error);
      }
    }

    // Ajout en base du jour + changement de couleur
    try {
      const fullDate = `${day}/${date.getMonth() + 1}/${date.getFullYear()}`;
      let dateObj = {
        day: day,
        month: date.getMonth() + 1,
        year: date.getFullYear(),
      };
      //Insertion en base
      await createDatePillTaken(dateObj, fullDate);
      // Ajout du jour dans le tableau des jour a afficher en Vert
      setDayPillTaken((previousDay) => {
        return [...previousDay, day];
      });
    } catch (error) {
      console.error("🚀 ~ pillsTaken ~ error:", error);
    }
  };

  const isPillTaken = (day) => {
    return dayPillTaken.includes(day);
  };

  useEffect(() => {
    const showDayPillTaken = async () => {
      try {
        const dates = await getDatesPillTaken();
        const daysPillTaken = [];
        for (const pillTaken of dates) {
          if (pillTaken.month === date.getMonth() + 1) {
            daysPillTaken.push(pillTaken.day);
          }
        }
        setDayPillTaken(daysPillTaken);
      } catch (error) {
        console.error("Error fetching dates:", error);
      }
    };
    showDayPillTaken();
  }, [date]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 flex items-center justify-center ">
        <div className="w-4/5 max-w-4xl h-8 flex justify-center items-center overflow-hidden shadow-lg shadow-black rounded-full bg-[#16223f] text-white">
          <div
            className="h-full px-2 flex items-center justify-center cursor-pointer leading-none"
            onClick={() => previousMonth()}
          >
            <p className="font-extrabold text-xs sm:text-sm md:text-base lg:text-lg">
              &lt;
            </p>
          </div>
          <div className="h-full flex-grow flex items-center justify-center bg-[#20325b] leading-none">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg">
              {date.toLocaleDateString("fr-fr", { month: "long" })}
            </p>
          </div>
          <div
            className="h-full px-2 flex items-center justify-center cursor-pointer leading-none"
            onClick={() => nextMonth()}
          >
            <p className="font-extrabold text-xs sm:text-sm md:text-base lg:text-lg">
              &gt;
            </p>
          </div>
        </div>
      </header>
      <main className="flex-grow flex justify-center items-center py-4">
        <div className="w-full max-w-4xl grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 md:gap-4">
          {Array.from({ length: nbDays }, (_, day) => (
            <div
              key={day}
              className="flex flex-col justify-center items-center"
            >
              <div
                className={`${
                  isPillTaken(day + 1) ? "bg-green-500" : "bg-red-500"
                } rounded-full h-8 w-8 sm:h-10 sm:w-10`}
                onClick={() => pillsTaken(day + 1)}
              ></div>
              <p className="text-xs sm:text-sm md:text-base text-white">
                {day + 1}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
