import React, { useState } from "react";
import { Link } from "react-router-dom";

const months = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

const daysOfWeek = ["D", "L", "M", "X", "J", "V", "S"];

const linksData = [
  { year: 2025, month: 2, day: 16, url: "https://drive.google.com/file/d/1nmai42BIDXeC-raDAljnH8VOxkEJVBZ8/view?usp=sharing" },
  { year: 2025, month: 2, day: 23, url: "https://drive.google.com/file/d/1RnNe2rl6UQU5E5CmVDTlfVSSNCJCNNk_/view?usp=sharing" },
  { year: 2025, month: 3, day: 16, url: "https://drive.google.com/file/d/1PpecK-ePocV9jJBF4aKfrGEIonLJlZZD/view?usp=sharing" },
  { year: 2025, month: 3, day: 30, url: "https://drive.google.com/file/d/1jWBNfoPYLteyhOHT6zXjdH5lg2c2XKgn/view?usp=sharing" },
  { year: 2025, month: 4, day: 13, url: "https://drive.google.com/file/d/1WwJ9VpwvIP-rYDI2esUUN1p4i1dAWahn/view?usp=sharing" },
  { year: 2025, month: 4, day: 26, url: "https://drive.google.com/file/d/1u0777Ewb4Rt9mvEegEg_d3GnSChFbjdO/view?usp=sharing" },
  { year: 2025, month: 5, day: 11, url: "https://drive.google.com/file/d/1o5hsY1VizfgGSmMtmZosFMWLGo9mJviL/view?usp=sharing" },
  { year: 2025, month: 5, day: 25, url: "https://drive.google.com/file/d/1jBZSkJFBFMzQfMxun-l5reGU4R_cegaf/view?usp=sharing" },
  { year: 2025, month: 6, day: 8,  url: "https://drive.google.com/file/d/1P7DSUluYFeX7qBUATNrWpnLrv1wLGkeX/view?usp=sharing" },
  { year: 2025, month: 6, day: 22, url: "https://drive.google.com/file/d/1slfXnFDBYQluSze6IHmo9qJmLVLWeYU2/view?usp=sharing" },
  { year: 2025, month: 7, day: 13, url: "https://drive.google.com/file/d/1C1-F7CLhzkuHCRVjfNHAmo7S3pOBpiSV/view?usp=sharing" },
  { year: 2025, month: 7, day: 27, url: "https://drive.google.com/file/d/1wwdDhchSxykwxWEnXCNOKLs-INdbdbYR/view?usp=sharing" },
  { year: 2025, month: 8, day: 10, url: "https://drive.google.com/file/d/1RrqY6CLtKwXqOo85riXoHBPAHq1lB40I/view?usp=sharing" },
  { year: 2025, month: 8, day: 24, url: "https://drive.google.com/file/d/1M9VZqdpMSJyi1rarpP6yQSlpcynDbK-0/view?usp=sharing" },
  { year: 2025, month: 9, day: 7,  url: "https://drive.google.com/file/d/17c6YbUNb_4GFRut3C3C1KZWAaZzPSy2o/view?usp=sharing" },
  { year: 2025, month: 9, day: 24, url: "https://drive.google.com/file/d/1XUej832-cpyD6P2OFq_PApzg0cYWl5zj/view?usp=sharing" },
  { year: 2025, month: 10, day: 5, url: "https://drive.google.com/file/d/14AVprNPDLt2mZkbB5lp9wUO_YNxqjTI2/view?usp=sharing" },
];

const isExternal = (url) => /^https?:\/\//i.test(url);

const fmtFecha = (y, m, d) => {
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("es-AR", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
};

const Calendar = () => {
  const today = new Date();
  const [currentYear] = useState(2025);
  const [currentMonth, setCurrentMonth] = useState(
    today.getFullYear() === 2025 ? today.getMonth() : 0
  );

  const prevMonth = () => currentMonth > 0 && setCurrentMonth(p => p - 1);
  const nextMonth = () => currentMonth < 11 && setCurrentMonth(p => p + 1);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const daysArray = Array(firstDayOfMonth).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  return (
    <div className="calendar">
      <div className="header-calendario">
        <button className="prev" onClick={prevMonth}>&lt;</button>
        <h2 id="month-year">{months[currentMonth]} {currentYear}</h2>
        <button className="next" onClick={nextMonth}>&gt;</button>
      </div>

      <div className="week-days">
        {daysOfWeek.map((d, i) => <div key={i} className="week-day">{d}</div>)}
      </div>

      <div className="days">
        {daysArray.map((day, index) => {
          if (day === null) return <div key={index} className="empty" />;

          const linkData = linksData.find(
            it => it.year === currentYear && it.month === currentMonth + 1 && it.day === day
          );

          const hasLink = Boolean(linkData);
          const externo = hasLink && isExternal(linkData.url);
          const title = hasLink
            ? (externo
                ? `Abrir enlace externo — ${fmtFecha(currentYear, currentMonth + 1, day)}`
                : `Ver carreras — ${fmtFecha(currentYear, currentMonth + 1, day)}`)
            : undefined;

          const aria = hasLink
            ? (externo
                ? `Abrir enlace externo del ${fmtFecha(currentYear, currentMonth + 1, day)}`
                : `Ver carreras del ${fmtFecha(currentYear, currentMonth + 1, day)}`)
            : undefined;

          return (
            <div
              key={index}
              className={`day ${hasLink ? "carrera" : ""} ${externo ? "externo" : "interno"}`}
            >
              {hasLink ? (
                externo ? (
                  <a
                    href={linkData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={title}
                    aria-label={aria}
                    className="day-link externo-link"
                  >
                    {day}<span className="ext-icon" aria-hidden>🔗</span>
                  </a>
                ) : (
                  <Link
                    to={linkData.url}
                    title={title}
                    aria-label={aria}
                    className="day-link interno-link"
                  >
                    {day}
                  </Link>
                )
              ) : (
                <span className="day-text">{day}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
