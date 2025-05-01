import {
  BooleanInput,
  Edit,
  ReferenceInput,
  SimpleForm,
  TextInput,
  required,
} from "react-admin";
import { sharedStyles } from "../sharedStyles";

export const ChallengeOptionEdit = () => {
  return (
    <Edit
      sx={{
        "& .RaEdit-main": sharedStyles.card,
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
    </Edit>
  );
};
