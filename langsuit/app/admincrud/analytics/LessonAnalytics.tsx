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

export const LessonAnalytics = () => {
  const { data: lessons, isLoading } = useGetList("lessons", {
    pagination: { page: 1, perPage: 100 },
  });

  const { data: units } = useGetList("units", {
    pagination: { page: 1, perPage: 100 },
  });

  const { data: courses } = useGetList("courses", {
    pagination: { page: 1, perPage: 100 },
  });

  if (isLoading) return null;

  // 1. Lessons per unit with course context
  const lessonsPerUnitWithCourse = lessons?.reduce((acc, lesson) => {
    const unit = units?.find((u) => u.id === lesson.unitId);
    const course = unit ? courses?.find((c) => c.id === unit.courseId) : null;

    const key = `${course?.title || "Unknown Course"} - ${
      unit?.title || "Unknown Unit"
    }`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const unitLessonData = Object.entries(lessonsPerUnitWithCourse || {})
    .map(([key, count]) => ({
      unitAndCourse: key,
      lessons: count,
    }))
    .sort((a, b) => b.lessons - a.lessons);

  // 2. Course-wise lesson distribution
  const courseLessonData = courses
    ?.map((course) => {
      const courseUnits = units?.filter((unit) => unit.courseId === course.id);
      const lessonCount = courseUnits?.reduce((acc, unit) => {
        return (
          acc +
          (lessons?.filter((lesson) => lesson.unitId === unit.id).length || 0)
        );
      }, 0);

      return {
        name: course.title,
        value: lessonCount,
      };
    })
    .filter((item) => item.value > 0);

  // 3. Average lessons per unit by course
  const avgLessonsPerUnitByCourse = courses
    ?.map((course) => {
      const courseUnits = units?.filter((unit) => unit.courseId === course.id);
      const totalLessons = courseUnits?.reduce((acc, unit) => {
        return (
          acc +
          (lessons?.filter((lesson) => lesson.unitId === unit.id).length || 0)
        );
      }, 0);

      return {
        course: course.title,
        average: courseUnits?.length
          ? (totalLessons / courseUnits.length).toFixed(1)
          : 0,
      };
    })
    .filter((item) => item.average > 0);

  return (
    <div className="p-4 space-y-8">
      <Title>Lesson Analytics Dashboard</Title>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">
            Lessons per Unit (By Course)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={unitLessonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="unitAndCourse"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={100}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="lessons" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">
            Total Lessons Distribution by Course
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={courseLessonData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {courseLessonData?.map((entry, index) => (
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
          <h3 className="text-lg font-medium mb-4">
            Average Lessons per Unit by Course
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={avgLessonsPerUnitByCourse}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="course"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={100}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="average" fill="#8884d8" name="Avg Lessons" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Summary Statistics</h3>
          <div className="space-y-4">
            <p className="text-lg">Total Lessons: {lessons?.length || 0}</p>
            <p className="text-lg">
              Total Units with Lessons:{" "}
              {Object.keys(lessonsPerUnitWithCourse || {}).length}
            </p>
            <p className="text-lg">
              Average Lessons per Unit:{" "}
              {(lessons?.length || 0) /
                (
                  Object.keys(lessonsPerUnitWithCourse || {}).length || 1
                ).toFixed(1)}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
