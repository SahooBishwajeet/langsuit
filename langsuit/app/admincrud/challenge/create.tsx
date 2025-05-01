import {
  Create,
  NumberInput,
  ReferenceInput,
  SelectInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";
import { sharedStyles } from "../sharedStyles";

export const ChallengeCreate = () => {
  return (
    <Create
      sx={{
        "& .RaCreate-main": sharedStyles.card,
      }}
    >
      <SimpleForm>
        <TextInput
          source="question"
          validate={[required()]}
          label="Question"
          sx={sharedStyles.input}
          fullWidth
        />
        <SelectInput
          source="type"
          validate={[required()]}
          choices={[
            { id: "SELECT", name: "SELECT" },
            { id: "ASSIST", name: "ASSIST" },
          ]}
          sx={sharedStyles.input}
          fullWidth
        />
        <ReferenceInput
          source="lessonId"
          reference="lessons"
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
