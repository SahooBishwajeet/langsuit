import {
  Create,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";
import { sharedStyles } from "../sharedStyles";

export const LessonCreate = () => {
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
        <ReferenceInput
          source="unitId"
          reference="units"
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
