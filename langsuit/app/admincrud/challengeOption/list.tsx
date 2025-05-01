import {
  BooleanField,
  Datagrid,
  List,
  NumberField,
  ReferenceField,
  TextField,
  TextInput,
} from "react-admin";
import { sharedStyles } from "../sharedStyles";

const listFilters = [
  <TextInput source="q" label="Search" alwaysOn sx={sharedStyles.input} />,
];

export const ChallengeOptionsList = () => {
  return (
    <List
      filters={listFilters}
      sx={{
        "& .RaList-main": sharedStyles.card,
      }}
    >
      <Datagrid rowClick="edit" sx={sharedStyles.table}>
        <NumberField source="id" />
        <TextField source="text" />
        <BooleanField source="correct" />
        <ReferenceField source="challengeId" reference="challenges" />
        <TextField source="imageSrc" />
        <TextField source="audioSrc" />
      </Datagrid>
    </List>
  );
};
