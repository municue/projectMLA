// src/components/Progress.jsx
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Label,
  AreaChart,
  Area,
} from "recharts";
import { logHistory } from "../utils/logHistory";
import { useAuth } from "../context/AuthContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import { FaEllipsisV } from "react-icons/fa";
import "./Progress.css";

export default function Progress() {
  const { user } = useAuth();
  const [chartData, setChartData] = useState([]);
  const [practiceData, setPracticeData] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const [filter, setFilter] = useState("this-week");

  // ✅ Topic Study Trends
  useEffect(() => {
    if (!user?.email) return;

    logHistory({
      userEmail: user.email,
      type: "progress-view",
      source: "progress",
    });

    const q = collection(db, "users", user.email, "progress");
    const unsubscribe = onSnapshot(q, (snap) => {
      let chartRows = [];

      snap.docs.forEach((docSnap, i) => {
        const data = docSnap.data();
        if (docSnap.id.startsWith("topic-")) {
          const topic = data.topic || "Unknown";
          const subtopic = data.subtopic || "";
          const timestamp = data.timestamp?.toDate
            ? data.timestamp.toDate()
            : null;

          chartRows.push({
            id: i,
            topicSubtopic: `${topic}: ${subtopic}`,
            seconds: data.seconds ?? 0,
            day: timestamp
              ? ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                  timestamp.getDay()
                ]
              : "",
            timestamp,
          });
        }
      });

      chartRows.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

      // ✅ Fix filter logic
      const filteredRows =
        filter === "all" ? chartRows : applyFilter(chartRows, filter);

      setChartData(filteredRows.slice(-20));
    });

    return () => unsubscribe();
  }, [user, filter]);

  // ✅ Practice Stats
  useEffect(() => {
    if (!user?.email) return;

    const q = collection(db, "users", user.email, "practiceProgress");
    const unsubscribe = onSnapshot(q, (snap) => {
      let rows = [];

      snap.docs.forEach((docSnap, i) => {
        const data = docSnap.data();
        if (!docSnap.id.includes("-summary")) return;

        const timestamp = data.timestamp?.toDate
          ? data.timestamp.toDate()
          : null;

        rows.push({
          id: i,
          topic: data.topic || "Unknown",
          subtopic: data.subtopic || "",
          difficulty: data.difficulty || "unspecified",
          totalCount: data.totalCount ?? 0,
          doneCount: data.doneCount ?? 0,
          timestamp,
        });
      });

      rows.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

      const filteredRows =
        filter === "all" ? rows : applyFilter(rows, filter);

      setPracticeData(filteredRows.slice(-20));
    });

    return () => unsubscribe();
  }, [user, filter]);

  // ✅ Shared filter logic
  const applyFilter = (rows, filterType) => {
    const now = new Date();
    if (filterType === "this-week") {
      return rows.filter(
        (r) => r.timestamp && now - r.timestamp <= 7 * 24 * 60 * 60 * 1000
      );
    } else if (filterType === "last-week") {
      return rows.filter(
        (r) =>
          r.timestamp &&
          now - r.timestamp > 7 * 24 * 60 * 60 * 1000 &&
          now - r.timestamp <= 14 * 24 * 60 * 60 * 1000
      );
    } else if (filterType === "last-2-days") {
      return rows.filter(
        (r) => r.timestamp && now - r.timestamp <= 2 * 24 * 60 * 60 * 1000
      );
    } else {
      return rows;
    }
  };

  // ✅ Format time properly
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  // ✅ Tooltip for topics
  const TopicTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="custom-tooltip">
          <p className="tooltip-title">
            <strong>{item.topicSubtopic}</strong>
          </p>
          <p>
            <strong>Day:</strong> {item.day || "N/A"}
          </p>
          {item.timestamp && (
            <p>
              <strong>Date:</strong> {item.timestamp.toLocaleDateString()}
            </p>
          )}
          <p className="tooltip-time" style={{ color: "#00bfff" }}>
            ⏱ Time Spent: {formatTime(item.seconds)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="progress-container">
      <div className="progress-header">
        <h2>Progress</h2>
        <div className="progress-menu">
          <FaEllipsisV
            className="menu-icon"
            onClick={() => setShowMenu((prev) => !prev)}
          />
          {showMenu && (
            <div className="progress-dropdown">
              <button
                onClick={() => setFilter("this-week")}
                className={filter === "this-week" ? "active" : ""}
              >
                📅 This Week
              </button>
              <button
                onClick={() => setFilter("last-week")}
                className={filter === "last-week" ? "active" : ""}
              >
                📅 Last Week
              </button>
              <button
                onClick={() => setFilter("last-2-days")}
                className={filter === "last-2-days" ? "active" : ""}
              >
                📅 Last 2 Days
              </button>
              <button
                onClick={() => setFilter("all")}
                className={filter === "all" ? "active" : ""}
              >
                📊 All (max 20)
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="progress-content">
        {/* ✅ Topic Study Trends */}
        <div className="full-chart scroll-scale">
          <h3 className="chart-title">Topic Study Trends</h3>
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={chartData} margin={{top:10, right: 20, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" stroke="#ccc" tick={false}>
                <Label value="Topic (Subtopic)" offset={30} position="bottom" />
              </XAxis>
              <YAxis stroke="#ccc" />
              <Tooltip content={<TopicTooltip />} />
              <Line
                type="monotone"
                dataKey="seconds"
                stroke="#00bfff"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Time Spent"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ✅ Practice Stats by Difficulty */}
        <div className="full-chart scroll-scale practice-stats-chart">
          <h3 className="chart-title">Practice Stats</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={practiceData} margin={{ top:10, right: 10, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis stroke="#ccc" tick={false} />
              <YAxis stroke="#ccc" />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload;
                    return (
                      <div className="practice-tooltip">
                        <p className="tooltip-name">
                          <strong>{item.topic}: {item.subtopic}</strong>
                        </p>
                        <p>🎯 Difficulty: {item.difficulty}</p>
                        <p style={{color: "green"}}>✅ Done: {item.doneCount}</p>
                        <p>📌 Total: {item.totalCount}</p>
                        <p>
                          📊 Completion:{" "}
                          {item.totalCount > 0
                            ? `${Math.round(
                                (item.doneCount / item.totalCount) * 100
                              )}%`
                            : "0%"}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="doneCount"
                stroke="#00ff99"
                fill="#00ff99"
                fillOpacity={0.3}
                name="Easy"
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="doneCount"
                stroke="#ffcc00"
                fill="#ffcc00"
                fillOpacity={0.3}
                name="Moderate"
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="doneCount"
                stroke="#ff4d4d"
                fill="#ff4d4d"
                fillOpacity={0.3}
                name="Hard"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
