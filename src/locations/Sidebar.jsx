import React, { useState } from "react";
import { Paragraph, Button, TextLink } from "@contentful/f36-components";
import { /*useCMA,*/ useSDK } from "@contentful/react-apps-toolkit";
import { createClient } from "contentful-management";
const Sidebar = () => {
  const sdk = useSDK();
  /*
     To use the cma, inject it as follows.
     If it is not needed, you can remove the next line.
  */
  // const cma = useCMA();

  const cma = createClient({ apiAdapter: sdk.cmaAdapter });

  const [working, setWorking] = useState(false);
  const [isDraft, setIsDraft] = useState("");
  const [isPublished, setIsPublished] = useState("");

  // EXPERIMENT: bitwise operator function
  // rules for fields, locales
  // bitwiseSecurity("111")
  // let bitwiseSecurity = async (userBW) => {
  //   let bw = parseInt(userBW, 2)
  //   if (bw & 4) {
  //     console.log("read allowed")
  //   }
  //   if (bw & 2) {
  //     console.log("edit allowed")
  //   }
  //   if (bw & 1) {
  //     console.log("enforce required field")
  //   }
  // }

  function renderStatusLabel() {
    autoTagEntry();

    if (isPublished === "") {
      return "Published";
    }

    if (isDraft === "") {
      return "Draft";
    }

    return "Published (pending changes)";
  }

  // async funtion to get the team name from an id
  let getTeamName = async (teamID) => {
    let res = "";
    var teamColl = await cma
      .getSpace(sdk.ids.space)
      .then((space) => space.getTeams());
    teamColl.items.forEach((spaceTeam) => {
      if (spaceTeam.sys.id === teamID) {
        res = spaceTeam.name;
      }
    });
    return res;
  };

  /**
   * Auto tag an etry based on team name,
   * the team name should be the same as tagID
   */
  let autoTagEntry = async () => {
    let userTeams = [];

    sdk.user.teamMemberships.forEach((teamMembership) => {
      userTeams.push(teamMembership.sys.team.sys.id);
    });
    let teamName = await getTeamName(userTeams[0]);

    await cma
      .getSpace(sdk.ids.space)
      .then((space) => space.getEnvironment(sdk.ids.environment))
      .then((environment) => environment.getEntry(sdk.ids.entry))
      .then((entry) => {
        const myTag = {
          sys: {
            type: "Link",
            linkType: "Tag",
            id: teamName,
          },
        };
        entry.metadata.tags.push(myTag);

        return entry.update();
      })
      .then((entry) => console.log(`Entry ${entry.sys.id} updated.`))
      .catch(console.error);
  };

  // disabled function in the app ()
  let publishEntry = async () => {
    await cma
      .getSpace(sdk.ids.space)
      .then((space) => space.getEnvironment(sdk.ids.environment))
      .then((environment) => environment.getEntry(sdk.ids.entry))
      .then((entry) => {
        return entry.publish();
      })
      .then((entry) => console.log(`Entry ${entry.sys.id} published.`))
      .catch(console.error);
  };

  function teamValidation() {
    // console.log(teamNames)

    let localesPass = false;
    let errMsg = "";
    /**
     * Rules on tag names and needed locales
     */
    const teamRules = [
      {
        name: "teamMexico",
        id: "3o9i7akLfDfDkg5hVm0hde", // temporal as to get a name will require an extra query
        rule: ["en-US", "fr-CH", "de-DE"], // content in this locales are required
      },
      {
        name: "teamSpain",
        id: "7q1IfTaG9tzsRZ6F4vBRfI", // temporal as to get a name will require an extra query
        rule: ["en-US", "fr-CH"], // content in this locales are required
      },
    ];

    sdk.user.teamMemberships.forEach((teamMembership) => {
      // check each one of the rules
      //teamMembership.sys.team.sys.id
      teamRules.forEach((teamRule) => {
        // comparing team id with team rule id
        if (teamMembership.sys.team.sys.id === teamRule.id) {
          const localesMust = teamRule.rule;
          // loop on each field and check for EN, BE content
          // if all content allow publish
          // else show alert on errors

          const entryFields = sdk.entry.fields;
          Object.keys(entryFields).forEach(function (fieldName, i) {
            localesMust.forEach((localeEvaluate) => {
              const fieldLocales = entryFields[fieldName].locales;

              if (fieldLocales.length > 1) {
                // check for locales that the field is setup to use (field localized)

                if (fieldLocales.includes(localeEvaluate)) {
                  if (
                    entryFields[fieldName].getValue(localeEvaluate) ===
                      undefined ||
                    entryFields[fieldName].getValue(localeEvaluate) === ""
                  ) {
                    localesPass = true;
                    errMsg += " field : " + fieldName + " -> " + localeEvaluate;
                  }
                } else {
                  localesPass = true;
                  errMsg += " field : " + fieldName + " -> " + localeEvaluate;
                }
              }
            });
          });
        }
      });
    });

    return { localesPass: localesPass, errMsg: errMsg };
  }

  function tagValidation() {
    // validation based on fields locales and tags
    // if tag1 -> check fields has content on locales EN, BE
    // other case -> allow
    const entryTags = sdk.entry.metadata.tags;

    // if entry has no tags, show dialog
    if (entryTags.length === 0) {
      sdk.dialogs.openCurrentApp({
        width: 800,
        title: "A team TAG is needed.",
        parameters: {
          message: "Missing en etry tag, please select your team as a tag",
          errMsg: "",
          value: 42,
        },
      });
      return;
    }

    /**
     * Rules on tag names and needed locales
     */
    const tagRules = [
      {
        name: "mexico",
        rule: ["en-US", "fr-CH"],
      },
    ];

    let localesPass = false;
    let errMsg = "";
    // check each one of the rules
    tagRules.forEach((tagRule) => {
      entryTags.forEach((tag) => {
        if (tag.sys.id === tagRule.name) {
          const localesMust = tagRule.rule;
          // loop on each field and check for EN, BE content
          // if all content allow publish
          // else show alert on errors

          const entryFields = sdk.entry.fields;
          Object.keys(entryFields).forEach(function (fieldName, i) {
            localesMust.forEach((localeEvaluate) => {
              const fieldLocales = entryFields[fieldName].locales;
              if (fieldLocales.length > 1) {
                // check for locales that the field is setup to use (field localized)

                if (fieldLocales.includes(localeEvaluate)) {
                  if (
                    entryFields[fieldName].getValue(localeEvaluate) ===
                      undefined ||
                    entryFields[fieldName].getValue(localeEvaluate) === ""
                  ) {
                    localesPass = true;
                    errMsg += " field : " + fieldName + " -> " + localeEvaluate;
                  }
                } else {
                  localesPass = true;
                  errMsg += " field : " + fieldName + " -> " + localeEvaluate;
                }
              }
            });
          });
        } //else {
        // other conditions
        // at this point allow everthig
        // }
      });
    });

    return { localesPass: localesPass, errMsg: errMsg };
  }

  function onClickPublish(event) {
    event.preventDefault();
    setWorking(true);

    const valdateTeam = true; // DEMO flag to activate the desired validation function
    let res = {};
    if (valdateTeam) {
      console.log("validating with teams");
      res = teamValidation();
    } else {
      console.log("validating with tags");
      res = tagValidation();
    }

    let localesPass = res.localesPass;
    let errMsg = res.errMsg;

    if (localesPass) {
      let title = "Locale missing";
      let message = "This entry is missing an entry:";
      // let confirmLabel = "Publish"
      sdk.dialogs.openCurrentApp({
        width: 800,
        title: title,
        parameters: { message: message, errMsg: errMsg, value: 42 },
      });
      return;
    } else {
      try {
        console.log("publishing");
        // publishEntry()

        /**
         * PUBLISH ENTRY HERE
         */
        sdk.dialogs.openCurrentApp({
          width: 800,
          title: "ABOUT TO PUBLISH!!!!",
          parameters: { message: "Publishign now", errMsg: "" },
        });
      } catch (error) {
        // this.onError(error)
        console.log(error);
      }
    }
  }

  function onClickUnpublish(event) {
    event.preventDefault();

    let title = "Unpublish entry?";
    let message =
      "This entry will be unpublished and will not be available on your website or app anymore.";

    // let confirmLabel = "Publish"
    sdk.dialogs.openCurrentApp({
      width: 800,
      title: title,
      parameters: { message: message, errMsg: "", value: 42 },
    });

    // try {
    //   await ext.space.unpublishEntry(entry)
    //   this.onUpdate()
    // } catch (error) {
    //   this.onError(error)
    // }
  }

  return (
    <>
      <Paragraph>
        Hello Sidebar publish Component (AppId: {sdk.ids.app})
      </Paragraph>

      <Paragraph className="f36-margin-bottom--s">
        <strong>Status: </strong>
        {renderStatusLabel()}
      </Paragraph>
      <Button
        className="publish-button"
        variant="primary"
        isFullWidth={true}
        onClick={onClickPublish}
        isLoading={working}
      >
        Publish
      </Button>
      <TextLink
        className="f36-margin-top--s f36-margin-bottom--xs"
        onClick={onClickUnpublish}
      >
        Unpublish
      </TextLink>
      <Paragraph>Last saved 'ago'</Paragraph>
    </>
  );
};

export default Sidebar;
