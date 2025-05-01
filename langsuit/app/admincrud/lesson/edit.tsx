import {
  Edit,
  NumberInput,
  ReferenceInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";
import { sharedStyles } from "../sharedStyles";

export const LessonEdit = () => {
  return (
    <Edit
      sx={{
        "& .RaEdit-main": sharedStyles.card,
      }}
    >
      <SimpleForm>
        <NumberInput
          source="id"
          validate={[required()]}
          label="Id"
          sx={sharedStyles.input}
          fullWidth
        />
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
    </Edit>
  );
};
