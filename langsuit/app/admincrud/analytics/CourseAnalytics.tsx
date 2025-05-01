import { Card, Title } from "@tremor/react";
import { useGetList } from "react-admin";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
];

export const CourseAnalytics = () => {
  const { data: courses, isLoading } = useGetList("courses", {
    pagination: { page: 1, perPage: 100 },
  });

  if (isLoading) return null;

  // 1. Language distribution from title (assuming format "Language - Course Name")
  const languageData = courses?.reduce((acc, course) => {
    const language = course.title.split("-")[0].trim();
    acc[language] = (acc[language] || 0) + 1;
    return acc;
  }, {});

  const languageChartData = Object.entries(languageData || {}).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  // 2. Instructor wise total courses
  const instructorData = courses?.reduce((acc, course) => {
    acc[course.instructorId] = (acc[course.instructorId] || 0) + 1;
    return acc;
  }, {});

  const instructorChartData = Object.entries(instructorData || {}).map(
    ([id, count]) => ({
      instructor: `Instructor ${id}`,
      courses: count,
    }),
  );

  // 3. Instructor wise language distribution
  const instructorLangData = courses?.reduce((acc, course) => {
    const language = course.title.split("-")[0].trim();
    const instructorId = course.instructorId;

    if (!acc[instructorId]) {
      acc[instructorId] = {};
    }
    acc[instructorId][language] = (acc[instructorId][language] || 0) + 1;
    return acc;
  }, {});

  const instructorLangChartData = Object.entries(instructorLangData || {}).map(
    ([instructorId, langs]) => ({
      instructor: `Instructor ${instructorId}`,
      ...langs,
    }),
  );

  // 4 & 5. Revenue calculations
  const revenueData = courses?.reduce(
    (acc, course) => {
      const language = course.title.split("-")[0].trim();
      const revenue = course.price * course.visits;
      acc.byLanguage[language] = (acc.byLanguage[language] || 0) + revenue;
      acc.byInstructor[course.instructorId] =
        (acc.byInstructor[course.instructorId] || 0) + revenue;
      return acc;
    },
    { byLanguage: {}, byInstructor: {} },
  );

  const languageRevenueData = Object.entries(revenueData?.byLanguage || {}).map(
    ([language, revenue]) => ({
      language,
      revenue,
    }),
  );

  const instructorRevenueData = Object.entries(
    revenueData?.byInstructor || {},
  ).map(([id, revenue]) => ({
    instructor: `Instructor ${id}`,
    revenue,
  }));

  return (
    <div className="p-4 space-y-8">
      <Title>Course Analytics Dashboard</Title>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Courses by Language</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={languageChartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {languageChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Courses per Instructor</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={instructorChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="instructor" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="courses" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">
            Language Revenue Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={languageRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="language" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Instructor Revenue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={instructorRevenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="instructor" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4 col-span-2">
          <h3 className="text-lg font-medium mb-4">
            Instructor Language Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={instructorLangChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="instructor" />
              <YAxis />
              <Tooltip />
              <Legend />
              {Object.keys(languageData || {}).map((language, index) => (
                <Bar
                  key={language}
                  dataKey={language}
                  fill={COLORS[index % COLORS.length]}
                  stackId="a"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
