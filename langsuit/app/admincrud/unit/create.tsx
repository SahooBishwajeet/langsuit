import {
  Create,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";
import { sharedStyles } from "../sharedStyles";

export const UnitCreate = () => {
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
          source="description"
          validate={[required()]}
          label="Description"
          sx={sharedStyles.input}
          fullWidth
        />
        <ReferenceInput
          source="courseId"
          reference="courses"
          sx={sharedStyles.input}
          fullWidth
        />
        <NumberInput
          source="order"
          validate={required()}
          label="Order"
          sx={sharedStyles.input}
          fullWidth
        />
      </SimpleForm>
    </Create>
  );
};
