// Welcome to your schema
//   Schema driven development is Keystone's modus operandi
//
// This file is where we define the lists, fields and hooks for our data.
// If you want to learn more about how lists are configured, please read
// - https://keystonejs.com/docs/config/lists

import { list, graphql } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";

// see https://keystonejs.com/docs/fields/overview for the full list of fields
//   this is a few common fields for an example
import {
  text,
  image,
  password,
  timestamp,
  virtual,
} from "@keystone-6/core/fields";

// if you want to make your own fields, see https://keystonejs.com/docs/guides/custom-fields

// when using Typescript, you can refine your types to a stricter subset by importing
// the generated types from '.keystone/types'
import type { Lists } from ".keystone/types";
import resizeImage from "./helper/resizeImage";
export const lists: Lists = {
  User: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll,

    // this is the fields for our User list
    fields: {
      // by adding isRequired, we enforce that every User should have a name
      //   if no name is provided, an error will be displayed
      name: text({ validation: { isRequired: true } }),

      email: text({
        validation: { isRequired: true },
        // by adding isIndexed: 'unique', we're saying that no user can have the same
        // email as another user - this may or may not be a good idea for your project
        isIndexed: "unique",
      }),

      password: password({ validation: { isRequired: true } }),

      // we can use this field to see what Posts this User has authored
      //   more on that in the Post list below

      createdAt: timestamp({
        // this sets the timestamp to Date.now() when the user is first created
        defaultValue: { kind: "now" },
      }),
    },
  }),

  Post: list({
    // WARNING
    //   for this starter project, anyone can create, query, update and delete anything
    //   if you want to prevent random people on the internet from accessing your data,
    //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
    access: allowAll, // this is the fields for our Post list
    fields: {
      title: text({ validation: { isRequired: true } }),
      cover: image({ storage: "my_local_images" }),
      coverCropped: image({ storage: "my_local_images" }),
    },
    hooks: {
      resolveInput: ({ resolvedData }) => {
        const { title, cover, coverCropped } = resolvedData;
        let croppedImage = {
          id: cover.id + "-cropped",
          extension: cover.extension,
          width: 400,
          height: 400,
          filesize: cover.filesize,
        };
        if (title) {
          return {
            ...resolvedData,
            coverCropped: croppedImage,
            title: title,
          };
        }
        return resolvedData;
      },
      afterOperation: ({ operation, item }) => {
        if (operation === "create") {
          resizeImage(item);
        }
      },
    },
  }),
};
