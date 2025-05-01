import {
  BooleanInput,
  Create,
  ReferenceInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";
import { sharedStyles } from "../sharedStyles";

export const ChallengeOptionCreate = () => {
  return (
    <Create
      sx={{
        "& .RaCreate-main": sharedStyles.card,
      }}
    >
      <SimpleForm>
        <TextInput
          source="text"
          validate={[required()]}
          label="Text"
          sx={sharedStyles.input}
          fullWidth
        />
        <BooleanInput
          source="correct"
          label="Correct option"
          sx={sharedStyles.input}
        />
        <ReferenceInput
          source="challengeId"
          reference="challenges"
          sx={sharedStyles.input}
          fullWidth
        />
        <TextInput
          source="imageSrc"
          label="Image URL"
          sx={sharedStyles.input}
          fullWidth
        />
        <TextInput
          source="audioSrc"
          label="Audio URL"
          sx={sharedStyles.input}
          fullWidth
        />
      </SimpleForm>
    </Create>
  );
};
