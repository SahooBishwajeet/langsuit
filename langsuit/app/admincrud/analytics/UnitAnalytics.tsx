import { Card, Title } from "@tremor/react";
import { useGetList } from "react-admin";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
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

export const UnitAnalytics = () => {
  const { data: units, isLoading } = useGetList("units", {
    pagination: { page: 1, perPage: 100 },
  });

  const { data: courses } = useGetList("courses", {
    pagination: { page: 1, perPage: 100 },
  });

  if (isLoading) return null;

  // 1. Units per course with course titles
  const unitsPerCourse = units?.reduce((acc, unit) => {
    const course = courses?.find((c) => c.id === unit.courseId);
    if (course) {
      acc[course.title] = (acc[course.title] || 0) + 1;
    }
    return acc;
  }, {});

  const courseUnitData = Object.entries(unitsPerCourse || {}).map(
    ([title, count]) => ({
      name: title,
      value: count,
    }),
  );

  // 2. Units per instructor (combining course and unit data)
  const unitsPerInstructor = units?.reduce((acc, unit) => {
    const course = courses?.find((c) => c.id === unit.courseId);
    if (course) {
      acc[course.instructorId] = {
        count: (acc[course.instructorId]?.count || 0) + 1,
        courses: {
          ...acc[course.instructorId]?.courses,
          [course.title]:
            (acc[course.instructorId]?.courses?.[course.title] || 0) + 1,
        },
      };
    }
    return acc;
  }, {});

  const instructorUnitData = Object.entries(unitsPerInstructor || {}).map(
    ([instructorId, data]) => ({
      instructor: `Instructor ${instructorId}`,
      units: data.count,
    }),
  );

  // 3. Course distribution by unit count categories
  const unitCountCategories = courseUnitData.reduce((acc, { value }) => {
    const category =
      value <= 3 ? "Small (1-3)" : value <= 6 ? "Medium (4-6)" : "Large (7+)";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const courseDistributionData = Object.entries(unitCountCategories).map(
    ([category, count]) => ({
      name: category,
      value: count,
    }),
  );

  return (
    <div className="p-4 space-y-8">
      <Title>Unit Analytics Dashboard</Title>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Units per Course</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseUnitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={100}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Units" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Units per Instructor</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={instructorUnitData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="instructor" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="units" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Course Size Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={courseDistributionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {courseDistributionData.map((entry, index) => (
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
          <h3 className="text-lg font-medium mb-4">Course Statistics</h3>
          <div className="space-y-4">
            <p className="text-lg">Total Units: {units?.length || 0}</p>
            <p className="text-lg">
              Average Units per Course:{" "}
              {(units?.length || 0) /
                (Object.keys(unitsPerCourse || {}).length || 1).toFixed(1)}
            </p>
            <p className="text-lg">
              Total Courses with Units:{" "}
              {Object.keys(unitsPerCourse || {}).length}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
