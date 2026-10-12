/**
 * All UI text for this locale, one JSON file per namespace.
 * To change copy, edit the JSON files — no code changes needed.
 */
import type ro from "../ro";
import common from "./common.json";
import home from "./home.json";
import models from "./models.json";
import about from "./about.json";
import legal from "./legal.json";
import testDrive from "./testDrive.json";
import rangeMap from "./rangeMap.json";
import advisor from "./advisor.json";
import contact from "./contact.json";

// `satisfies` makes TypeScript flag any key that exists in Romanian but is missing here.
const messages = { common, home, models, about, legal, testDrive, rangeMap, advisor, contact } satisfies typeof ro;

export default messages;
