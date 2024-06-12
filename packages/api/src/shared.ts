import { Temporal } from "@js-temporal/polyfill"
import superjson from "superjson"

superjson.registerCustom(
   {
      isApplicable: (v): v is Temporal.PlainDate =>
         v instanceof Temporal.PlainDate,
      serialize: (v) => v.toJSON(),
      deserialize: (v) => Temporal.PlainDate.from(v),
   },
   "Temporal.PlainDate"
)

superjson.registerCustom(
   {
      isApplicable: (v): v is Temporal.PlainDateTime =>
         v instanceof Temporal.PlainDateTime,
      serialize: (v) => v.toJSON(),
      deserialize: (v) => Temporal.PlainDateTime.from(v),
   },
   "Temporal.PlainDateTime"
)

export const transformer = superjson
