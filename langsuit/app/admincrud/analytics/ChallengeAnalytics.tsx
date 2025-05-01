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

export const ChallengeAnalytics = () => {
  const { data: challenges, isLoading } = useGetList("challenges", {
    pagination: { page: 1, perPage: 100 },
  });

  const { data: lessons } = useGetList("lessons", {
    pagination: { page: 1, perPage: 100 },
  });

  const { data: units } = useGetList("units", {
    pagination: { page: 1, perPage: 100 },
  });

  const { data: courses } = useGetList("courses", {
    pagination: { page: 1, perPage: 100 },
  });

  if (isLoading) return null;

  // 1. Challenge Type Distribution
  const typeDistribution = challenges?.reduce((acc, challenge) => {
    acc[challenge.type] = (acc[challenge.type] || 0) + 1;
    return acc;
  }, {});

  const typeData = Object.entries(typeDistribution || {}).map(
    ([type, count]) => ({
      name: type,
      value: count,
    }),
  );

  // 2. Hierarchical Challenge Distribution
  const challengeHierarchy = challenges?.reduce((acc, challenge) => {
    const lesson = lessons?.find((l) => l.id === challenge.lessonId);
    const unit = lesson ? units?.find((u) => u.id === lesson.unitId) : null;
    const course = unit ? courses?.find((c) => c.id === unit.courseId) : null;

    if (course) {
      if (!acc[course.title]) acc[course.title] = { total: 0, units: {} };
      if (!acc[course.title].units[unit.title]) {
        acc[course.title].units[unit.title] = { total: 0, lessons: {} };
      }
      if (!acc[course.title].units[unit.title].lessons[lesson.title]) {
        acc[course.title].units[unit.title].lessons[lesson.title] = {
          total: 0,
          types: {},
        };
      }

      acc[course.title].total += 1;
      acc[course.title].units[unit.title].total += 1;
      acc[course.title].units[unit.title].lessons[lesson.title].total += 1;
      acc[course.title].units[unit.title].lessons[lesson.title].types[
        challenge.type
      ] =
        (acc[course.title].units[unit.title].lessons[lesson.title].types[
          challenge.type
        ] || 0) + 1;
    }
    return acc;
  }, {});

  // 3. Course-level Challenge Distribution
  const courseChallengeData = Object.entries(challengeHierarchy || {}).map(
    ([course, data]) => ({
      name: course,
      value: data.total,
    }),
  );

  // 4. Type Distribution by Course
  const typesByCourse = Object.entries(challengeHierarchy || {}).map(
    ([course, data]) => {
      const types = {};
      Object.values(data.units).forEach((unit) => {
        Object.values(unit.lessons).forEach((lesson) => {
          Object.entries(lesson.types).forEach(([type, count]) => {
            types[type] = (types[type] || 0) + count;
          });
        });
      });
      return {
        course,
        ...types,
      };
    },
  );

  // 5. Detailed lesson-level challenge distribution
  const lessonLevelData = challenges?.reduce((acc, challenge) => {
    const lesson = lessons?.find((l) => l.id === challenge.lessonId);
    const unit = lesson ? units?.find((u) => u.id === lesson.unitId) : null;
    const course = unit ? courses?.find((c) => c.id === unit.courseId) : null;

    if (course && lesson) {
      const key = `${course.title} - ${lesson.title}`;
      if (!acc[key]) {
        acc[key] = {
          id: key,
          courseName: course.title,
          lessonName: lesson.title,
          SELECT: 0,
          ASSIST: 0,
        };
      }
      acc[key][challenge.type]++;
    }
    return acc;
  }, {});

  const detailedChallengeData = Object.values(lessonLevelData || {}).sort(
    (a, b) => a.courseName.localeCompare(b.courseName),
  );

  return (
    <div className="p-4 space-y-8">
      <Title>Challenge Analytics Dashboard</Title>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">
            Challenge Types Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {typeData.map((entry, index) => (
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
          <h3 className="text-lg font-medium mb-4">Challenges per Course</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseChallengeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Challenges" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">
            Challenge Types by Course
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typesByCourse}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="course"
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="SELECT" stackId="a" fill="#8884d8" />
              <Bar dataKey="ASSIST" stackId="a" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-medium mb-4">Summary Statistics</h3>
          <div className="space-y-4">
            <p className="text-lg">
              Total Challenges: {challenges?.length || 0}
            </p>
            <p className="text-lg">
              SELECT Challenges: {typeDistribution?.SELECT || 0}
            </p>
            <p className="text-lg">
              ASSIST Challenges: {typeDistribution?.ASSIST || 0}
            </p>
            <p className="text-lg">
              Average Challenges per Lesson:{" "}
              {((challenges?.length || 0) / (lessons?.length || 1)).toFixed(1)}
            </p>
          </div>
        </Card>

        <Card className="p-4 col-span-2">
          <h3 className="text-lg font-medium mb-4">
            Detailed Challenge Distribution by Course and Lesson
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={detailedChallengeData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 100,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="id"
                angle={-45}
                textAnchor="end"
                height={100}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip
                formatter={(value, name, props) => [
                  value,
                  `${name} Challenges`,
                ]}
                labelFormatter={(label) => `Course - Lesson: ${label}`}
              />
              <Legend />
              <Bar
                dataKey="SELECT"
                stackId="a"
                fill="#8884d8"
                name="SELECT Challenges"
              />
              <Bar
                dataKey="ASSIST"
                stackId="a"
                fill="#82ca9d"
                name="ASSIST Challenges"
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
};
