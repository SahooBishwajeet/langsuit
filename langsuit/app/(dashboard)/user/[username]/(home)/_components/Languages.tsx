import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

const Languages = () => {
  const { user } = useUser();
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLanguages = async () => {
      if (!user) return;

      try {
        const response = await axios.get(`/api/user/${user.id}/languages`);
        setLanguages(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching languages:", error);
        setLoading(false);
      }
    };

    fetchLanguages();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 bg-gray-800 rounded">
      <h2 className="text-xl font-semibold text-white">Languages</h2>
      <ul className="mt-2">
        {languages.map((language) => (
          <li key={language.id} className="text-white">
            {language.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Languages;
