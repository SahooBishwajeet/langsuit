import { Create, SimpleForm, TextInput, required } from "react-admin";
import { sharedStyles } from "../sharedStyles";

export const CourseCreate = () => {
  return (
    <Create
      sx={{
        "& .RaCreate-main": sharedStyles.card,
      }}
    >
      <SimpleForm>
        <TextInput
          source="title"
          validate={[required()]}
          label="Title"
          sx={sharedStyles.input}
          fullWidth
        />
        <TextInput
          source="imageSrc"
          validate={[required()]}
          label="Image"
          sx={sharedStyles.input}
          fullWidth
        />
        <TextInput
          source="instructorId"
          validate={[required()]}
          label="Instructor"
          sx={sharedStyles.input}
          fullWidth
        />
        <TextInput
          source="category"
          validate={[required()]}
          label="Category"
          sx={sharedStyles.input}
          fullWidth
        />
      </SimpleForm>
    </Create>
  );
};
