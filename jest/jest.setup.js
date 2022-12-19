// This runs before each jest enzyme test
import Adapter from "enzyme-adapter-react-16";
import { configure } from "enzyme";
import "regenerator-runtime/runtime";

configure({ adapter: new Adapter() });
