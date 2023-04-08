import { defineComponent, h } from 'vue'
import SchemaFrom from './SchemaForm'
import StringField from './fileds/StringField'
import NumberField from './fileds/NumberField'
import ObjectField from './fileds/ObjectField'
import ArrayField from './fileds/ArrayField'
import SelectionWidget from './widget/SelectionWidget'
import ThemeProvider from './theme'

export default SchemaFrom
export {
  NumberField,
  StringField,
  ObjectField,
  ArrayField,
  SelectionWidget,
  ThemeProvider,
}
