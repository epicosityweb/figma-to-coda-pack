import * as coda from "@codahq/packs-sdk";

// Initialize the pack
export const pack = coda.newPack();

// Add network domain for Figma API
pack.addNetworkDomain("figma.com");

// Configure OAuth2 authentication
pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: "https://www.figma.com/oauth",
  tokenUrl: "https://api.figma.com/v1/oauth/token",
  scopes: ["file_read", "projects:read"],

  // Get connection name to display in Coda
  getConnectionName: async function (context) {
    try {
      const response = await context.fetcher.fetch({
        method: "GET",
        url: "https://api.figma.com/v1/me",
      });

      return response.body.handle || response.body.email || "Figma User";
    } catch (error) {
      // Fallback if user endpoint fails
      return "Figma User";
    }
  },
});

// Test formula to validate OAuth connection
pack.addFormula({
  name: "TestConnection",
  description: "Test the Figma OAuth connection and return user information",
  parameters: [],
  resultType: coda.ValueType.Object,
  schema: coda.makeObjectSchema({
    properties: {
      userId: {
        type: coda.ValueType.String,
        description: "The user's Figma ID",
      },
      handle: {
        type: coda.ValueType.String,
        description: "The user's Figma handle/username",
      },
      email: {
        type: coda.ValueType.String,
        description: "The user's email address",
      },
      img_url: {
        type: coda.ValueType.String,
        codaType: coda.ValueHintType.ImageReference,
        description: "The user's profile image URL",
      },
    },
    displayProperty: "handle",
    titleProperty: "handle",
    subtitleProperties: ["email"],
    imageProperty: "img_url",
  }),
  execute: async function ([], context) {
    let response;
    try {
      response = await context.fetcher.fetch({
        method: "GET",
        url: "https://api.figma.com/v1/me",
      });
    } catch (error) {
      if (coda.StatusCodeError.isStatusCodeError(error)) {
        const statusError = error as coda.StatusCodeError;
        const message = statusError.body?.message || statusError.message;
        throw new coda.UserVisibleError(`Failed to connect to Figma: ${message}`);
      }
      throw error;
    }

    const user = response.body;

    return {
      userId: user.id,
      handle: user.handle,
      email: user.email,
      img_url: user.img_url,
    };
  },
});

// Simple test formula to verify API access with a team URL
pack.addFormula({
  name: "TestTeamAccess",
  description: "Test access to a Figma team and return basic team information",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "teamUrl",
      description: "Your Figma team URL (e.g., https://www.figma.com/files/team/123456789)",
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: coda.makeObjectSchema({
    properties: {
      teamId: {
        type: coda.ValueType.String,
        description: "The team ID extracted from the URL",
      },
      componentCount: {
        type: coda.ValueType.Number,
        description: "Number of components found in the team",
      },
      status: {
        type: coda.ValueType.String,
        description: "Connection status message",
      },
    },
    displayProperty: "status",
    titleProperty: "status",
  }),
  execute: async function ([teamUrl], context) {
    // Extract team ID from URL
    const regex = /https:\/\/www\.figma\.com\/files\/(?:\d+\/)?team\/(\d+)/;
    const matches = teamUrl.match(regex);
    const teamId = matches ? matches[1] : null;

    if (!teamId) {
      throw new coda.UserVisibleError("Invalid team URL format. Please provide a valid Figma team URL.");
    }

    let response;
    try {
      response = await context.fetcher.fetch({
        method: "GET",
        url: `https://api.figma.com/v1/teams/${teamId}/components`,
      });
    } catch (error) {
      if (coda.StatusCodeError.isStatusCodeError(error)) {
        const statusError = error as coda.StatusCodeError;
        const message = statusError.body?.message || statusError.message;
        throw new coda.UserVisibleError(`Failed to access team: ${message}`);
      }
      throw error;
    }

    const componentCount = response.body.meta?.components?.length || 0;

    return {
      teamId: teamId,
      componentCount: componentCount,
      status: `Successfully connected! Found ${componentCount} components in team.`,
    };
  },
});

// Schema for Figma components
const ComponentsSchema = coda.makeObjectSchema({
  properties: {
    key: {
      type: coda.ValueType.String,
      description: "The unique key for the component",
    },
    file_key: {
      type: coda.ValueType.String,
      description: "The key associated with the file containing the component",
    },
    node_id: {
      type: coda.ValueType.String,
      description: "The unique identifier for the node associated with the component",
    },
    thumbnail_url: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
      description: "The URL for the component's thumbnail image",
    },
    name: {
      type: coda.ValueType.String,
      description: "The name of the component",
    },
    description: {
      type: coda.ValueType.String,
      description: "A brief description of the component",
    },
    created_at: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.DateTime,
      description: "The date and time when the component was created",
    },
    updated_at: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.DateTime,
      description: "The date and time when the component was last updated",
    },
    user: {
      type: coda.ValueType.Object,
      description: "Information about the user who created the component",
      properties: {
        id: {
          type: coda.ValueType.String,
          description: "The user's Figma ID",
        },
        handle: {
          type: coda.ValueType.String,
          description: "The user's Figma handle/username",
        },
        img_url: {
          type: coda.ValueType.String,
          codaType: coda.ValueHintType.ImageReference,
          description: "The user's profile image URL",
        },
      },
    },
    containing_frame: {
      type: coda.ValueType.Object,
      description: "Details about the frame containing the component",
      properties: {
        pageId: {
          type: coda.ValueType.String,
          description: "The ID of the page containing the frame",
        },
        pageName: {
          type: coda.ValueType.String,
          description: "The name of the page containing the frame",
        },
      },
    },
    link: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
      description: "Direct link to the component in Figma",
    },
  },
  idProperty: "key",
  displayProperty: "name",
  titleProperty: "name",
  featuredProperties: ["name", "description", "thumbnail_url", "updated_at", "user"],
});

// Schema for Figma styles
const StylesSchema = coda.makeObjectSchema({
  properties: {
    key: {
      type: coda.ValueType.String,
      description: "The unique key for the style",
    },
    file_key: {
      type: coda.ValueType.String,
      description: "The key associated with the file containing the style",
    },
    node_id: {
      type: coda.ValueType.String,
      description: "The unique identifier for the node associated with the style",
    },
    style_type: {
      type: coda.ValueType.String,
      description: "The type of the style (FILL, TEXT, EFFECT, GRID)",
    },
    thumbnail_url: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
      description: "The URL for the style's thumbnail image",
    },
    name: {
      type: coda.ValueType.String,
      description: "The name of the style",
    },
    description: {
      type: coda.ValueType.String,
      description: "A brief description of the style",
    },
    created_at: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.DateTime,
      description: "The date and time when the style was created",
    },
    updated_at: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.DateTime,
      description: "The date and time when the style was last updated",
    },
    sort_position: {
      type: coda.ValueType.String,
      description: "The position of the style in a sorted list",
    },
    user: {
      type: coda.ValueType.Object,
      description: "Information about the user who created the style",
      properties: {
        id: {
          type: coda.ValueType.String,
          description: "The user's Figma ID",
        },
        handle: {
          type: coda.ValueType.String,
          description: "The user's Figma handle/username",
        },
        img_url: {
          type: coda.ValueType.String,
          codaType: coda.ValueHintType.ImageReference,
          description: "The user's profile image URL",
        },
      },
    },
    link: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
      description: "Direct link to the style in Figma",
    },
  },
  idProperty: "key",
  displayProperty: "name",
  titleProperty: "name",
  featuredProperties: ["name", "description", "style_type", "thumbnail_url", "user", "created_at"],
});

// Schema for Figma component sets
const ComponentSetsSchema = coda.makeObjectSchema({
  properties: {
    key: {
      type: coda.ValueType.String,
      description: "The unique key for the component set",
    },
    file_key: {
      type: coda.ValueType.String,
      description: "The key associated with the file containing the component set",
    },
    node_id: {
      type: coda.ValueType.String,
      description: "The unique identifier for the node associated with the component set",
    },
    thumbnail_url: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
      description: "The URL for the component set's thumbnail image",
    },
    name: {
      type: coda.ValueType.String,
      description: "The name of the component set",
    },
    description: {
      type: coda.ValueType.String,
      description: "A brief description of the component set",
    },
    created_at: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.DateTime,
      description: "The date and time when the component set was created",
    },
    updated_at: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.DateTime,
      description: "The date and time when the component set was last updated",
    },
    user: {
      type: coda.ValueType.Object,
      description: "Information about the user who created the component set",
      properties: {
        id: {
          type: coda.ValueType.String,
          description: "The user's Figma ID",
        },
        handle: {
          type: coda.ValueType.String,
          description: "The user's Figma handle/username",
        },
        img_url: {
          type: coda.ValueType.String,
          codaType: coda.ValueHintType.ImageReference,
          description: "The user's profile image URL",
        },
      },
    },
    containing_frame: {
      type: coda.ValueType.Object,
      description: "Details about the frame containing the component set",
      properties: {
        name: {
          type: coda.ValueType.String,
          description: "The name of the frame containing the component set",
        },
        nodeId: {
          type: coda.ValueType.String,
          description: "The node ID of the frame containing the component set",
        },
        pageId: {
          type: coda.ValueType.String,
          description: "The ID of the page containing the frame",
        },
        pageName: {
          type: coda.ValueType.String,
          description: "The name of the page containing the frame",
        },
        backgroundColor: {
          type: coda.ValueType.String,
          description: "The background color of the frame",
        },
      },
    },
    link: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
      description: "Direct link to the component set in Figma",
    },
  },
  idProperty: "key",
  displayProperty: "name",
  titleProperty: "name",
  featuredProperties: ["name", "description", "thumbnail_url", "user", "created_at"],
});

// Schema for Figma projects
const ProjectsSchema = coda.makeObjectSchema({
  properties: {
    id: {
      type: coda.ValueType.String,
      description: "The unique ID of the project",
    },
    name: {
      type: coda.ValueType.String,
      description: "The name of the project",
    },
    teamId: {
      type: coda.ValueType.String,
      description: "The ID of the team this project belongs to",
    },
    fileCount: {
      type: coda.ValueType.Number,
      description: "Number of files in the project (estimated)",
    },
    created_at: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.DateTime,
      description: "When the project was created",
    },
    modified_at: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.DateTime,
      description: "When the project was last modified",
    },
    link: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
      description: "Direct link to the project in Figma",
    },
  },
  idProperty: "id",
  displayProperty: "name",
  titleProperty: "name",
  featuredProperties: ["name", "fileCount", "modified_at"],
});

// Schema for Figma project files
const ProjectFilesSchema = coda.makeObjectSchema({
  properties: {
    key: {
      type: coda.ValueType.String,
      description: "The unique file key",
    },
    name: {
      type: coda.ValueType.String,
      description: "The name of the file",
    },
    thumbnail_url: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.ImageReference,
      description: "Thumbnail image of the file",
    },
    last_modified: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.DateTime,
      description: "When the file was last modified",
    },
    editor_type: {
      type: coda.ValueType.String,
      description: "The type of editor (design, figjam, etc.)",
    },
    projectId: {
      type: coda.ValueType.String,
      description: "The ID of the parent project",
    },
    projectName: {
      type: coda.ValueType.String,
      description: "The name of the parent project",
    },
    branches: {
      type: coda.ValueType.Object,
      description: "Branch metadata if available",
      properties: {
        count: {
          type: coda.ValueType.Number,
          description: "Number of branches",
        },
        main_file_key: {
          type: coda.ValueType.String,
          description: "Key of the main file",
        },
      },
    },
    link: {
      type: coda.ValueType.String,
      codaType: coda.ValueHintType.Url,
      description: "Direct link to the file in Figma",
    },
  },
  idProperty: "key",
  displayProperty: "name",
  titleProperty: "name",
  featuredProperties: ["name", "thumbnail_url", "last_modified", "projectName"],
});

// Sync table for team components
pack.addSyncTable({
  name: "TeamComponents",
  description: "Get a list of all components from a Figma team",
  identityName: "TeamComponent",
  schema: ComponentsSchema,
  formula: {
    name: "SyncTeamComponents",
    description: "Syncs all components from a Figma team",
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "teamUrl",
        description: "Your Figma team URL (e.g., https://www.figma.com/files/team/123456789)",
      }),
    ],
    execute: async function ([teamUrl], context) {
      // Extract team ID from URL using the same regex pattern as TestTeamAccess
      const regex = /https:\/\/www\.figma\.com\/files\/(?:\d+\/)?team\/(\d+)/;
      const matches = teamUrl.match(regex);
      const teamId = matches ? matches[1] : null;

      if (!teamId) {
        throw new coda.UserVisibleError("Invalid team URL format. Please provide a valid Figma team URL like: https://www.figma.com/files/team/123456789");
      }

      // Build API URL with pagination support
      let url = `https://api.figma.com/v1/teams/${teamId}/components`;
      if (context.sync.continuation?.after) {
        url += `?after=${context.sync.continuation.after}`;
      }

      let response;
      try {
        response = await context.fetcher.fetch({
          method: "GET",
          url: url,
        });
      } catch (error) {
        if (coda.StatusCodeError.isStatusCodeError(error)) {
          const statusError = error as coda.StatusCodeError;
          const message = statusError.body?.message || statusError.message;
          throw new coda.UserVisibleError(`Failed to access team components: ${message}`);
        }
        throw error;
      }

      const components = response.body.meta?.components || [];
      const cursor = response.body.meta?.cursor;

      // Transform API response to match our schema
      const rows = components.map((c: any) => ({
        key: c.key,
        file_key: c.file_key,
        node_id: c.node_id,
        thumbnail_url: c.thumbnail_url,
        name: c.name,
        description: c.description || "",
        created_at: c.created_at,
        updated_at: c.updated_at,
        user: {
          id: c.user?.id || "",
          handle: c.user?.handle || "",
          img_url: c.user?.img_url || "",
        },
        containing_frame: {
          pageId: c.containing_frame?.pageId || "",
          pageName: c.containing_frame?.pageName || "",
        },
        link: `https://www.figma.com/file/${c.file_key}/?node-id=${encodeURIComponent(c.node_id)}`,
      }));

      return {
        result: rows,
        continuation: cursor ? { after: cursor.after } : undefined,
      };
    },
  },
});

// Sync table for file components
pack.addSyncTable({
  name: "FileComponents",
  description: "Get a list of all components from a Figma file",
  identityName: "FileComponent",
  schema: ComponentsSchema,
  formula: {
    name: "SyncFileComponents",
    description: "Syncs all components from a Figma file",
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "fileUrl",
        description: "Your Figma file URL (e.g., https://www.figma.com/file/ABC123/filename or https://www.figma.com/design/ABC123/filename)",
      }),
    ],
    execute: async function ([fileUrl], context) {
      // Extract file key from URL - supports both /file/ and /design/ formats
      const regex = /https:\/\/www\.figma\.com\/(file|design)\/([a-zA-Z0-9]+)/;
      const matches = fileUrl.match(regex);
      const fileKey = matches ? matches[2] : null;

      if (!fileKey) {
        throw new coda.UserVisibleError("Invalid file URL format. Please provide a valid Figma file URL like: https://www.figma.com/file/ABC123/filename");
      }

      // Build API URL with pagination support
      let url = `https://api.figma.com/v1/files/${fileKey}/components`;
      if (context.sync.continuation?.after) {
        url += `?after=${context.sync.continuation.after}`;
      }

      let response;
      try {
        response = await context.fetcher.fetch({
          method: "GET",
          url: url,
        });
      } catch (error) {
        if (coda.StatusCodeError.isStatusCodeError(error)) {
          const statusError = error as coda.StatusCodeError;
          const message = statusError.body?.message || statusError.message;
          throw new coda.UserVisibleError(`Failed to access file components: ${message}`);
        }
        throw error;
      }

      const components = response.body.meta?.components || [];
      const cursor = response.body.meta?.cursor;

      // Transform API response to match our schema
      const rows = components.map((c: any) => ({
        key: c.key,
        file_key: c.file_key,
        node_id: c.node_id,
        thumbnail_url: c.thumbnail_url,
        name: c.name,
        description: c.description || "",
        created_at: c.created_at,
        updated_at: c.updated_at,
        user: {
          id: c.user?.id || "",
          handle: c.user?.handle || "",
          img_url: c.user?.img_url || "",
        },
        containing_frame: {
          pageId: c.containing_frame?.pageId || "",
          pageName: c.containing_frame?.pageName || "",
        },
        link: `https://www.figma.com/file/${c.file_key}/?node-id=${encodeURIComponent(c.node_id)}`,
      }));

      return {
        result: rows,
        continuation: cursor ? { after: cursor.after } : undefined,
      };
    },
  },
});

// Sync table for file styles
pack.addSyncTable({
  name: "FileStyles",
  description: "Get a list of all styles from a Figma file",
  identityName: "FileStyle",
  schema: StylesSchema,
  formula: {
    name: "SyncFileStyles",
    description: "Syncs all styles from a Figma file",
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "fileUrl",
        description: "Your Figma file URL (e.g., https://www.figma.com/file/ABC123/filename or https://www.figma.com/design/ABC123/filename)",
      }),
    ],
    execute: async function ([fileUrl], context) {
      // Extract file key from URL - supports both /file/ and /design/ formats
      const regex = /https:\/\/www\.figma\.com\/(file|design)\/([a-zA-Z0-9]+)/;
      const matches = fileUrl.match(regex);
      const fileKey = matches ? matches[2] : null;

      if (!fileKey) {
        throw new coda.UserVisibleError("Invalid file URL format. Please provide a valid Figma file URL like: https://www.figma.com/file/ABC123/filename");
      }

      // Build API URL with pagination support
      let url = `https://api.figma.com/v1/files/${fileKey}/styles`;
      if (context.sync.continuation?.after) {
        url += `?after=${context.sync.continuation.after}`;
      }

      let response;
      try {
        response = await context.fetcher.fetch({
          method: "GET",
          url: url,
        });
      } catch (error) {
        if (coda.StatusCodeError.isStatusCodeError(error)) {
          const statusError = error as coda.StatusCodeError;
          const message = statusError.body?.message || statusError.message;
          throw new coda.UserVisibleError(`Failed to access file styles: ${message}`);
        }
        throw error;
      }

      const styles = response.body.meta?.styles || [];
      const cursor = response.body.meta?.cursor;

      // Transform API response to match our schema
      const rows = styles.map((s: any) => ({
        key: s.key,
        file_key: s.file_key,
        node_id: s.node_id,
        style_type: s.style_type,
        thumbnail_url: s.thumbnail_url,
        name: s.name,
        description: s.description || "",
        created_at: s.created_at,
        updated_at: s.updated_at,
        sort_position: s.sort_position || "",
        user: {
          id: s.user?.id || "",
          handle: s.user?.handle || "",
          img_url: s.user?.img_url || "",
        },
        link: `https://www.figma.com/file/${s.file_key}/?node-id=${encodeURIComponent(s.node_id)}`,
      }));

      return {
        result: rows,
        continuation: cursor ? { after: cursor.after } : undefined,
      };
    },
  },
});

// Sync table for file component sets
pack.addSyncTable({
  name: "FileComponentSets",
  description: "Get a list of all component sets from a Figma file",
  identityName: "FileComponentSet",
  schema: ComponentSetsSchema,
  formula: {
    name: "SyncFileComponentSets",
    description: "Syncs all component sets from a Figma file",
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "fileUrl",
        description: "Your Figma file URL (e.g., https://www.figma.com/file/ABC123/filename or https://www.figma.com/design/ABC123/filename)",
      }),
    ],
    execute: async function ([fileUrl], context) {
      // Extract file key from URL - supports both /file/ and /design/ formats
      const regex = /https:\/\/www\.figma\.com\/(file|design)\/([a-zA-Z0-9]+)/;
      const matches = fileUrl.match(regex);
      const fileKey = matches ? matches[2] : null;

      if (!fileKey) {
        throw new coda.UserVisibleError("Invalid file URL format. Please provide a valid Figma file URL like: https://www.figma.com/file/ABC123/filename");
      }

      // Build API URL with pagination support
      let url = `https://api.figma.com/v1/files/${fileKey}/component_sets`;
      if (context.sync.continuation?.after) {
        url += `?after=${context.sync.continuation.after}`;
      }

      let response;
      try {
        response = await context.fetcher.fetch({
          method: "GET",
          url: url,
        });
      } catch (error) {
        if (coda.StatusCodeError.isStatusCodeError(error)) {
          const statusError = error as coda.StatusCodeError;
          const message = statusError.body?.message || statusError.message;
          throw new coda.UserVisibleError(`Failed to access file component sets: ${message}`);
        }
        throw error;
      }

      const componentSets = response.body.meta?.component_sets || [];
      const cursor = response.body.meta?.cursor;

      // Transform API response to match our schema
      const rows = componentSets.map((cs: any) => ({
        key: cs.key,
        file_key: cs.file_key,
        node_id: cs.node_id,
        thumbnail_url: cs.thumbnail_url,
        name: cs.name,
        description: cs.description || "",
        created_at: cs.created_at,
        updated_at: cs.updated_at,
        user: {
          id: cs.user?.id || "",
          handle: cs.user?.handle || "",
          img_url: cs.user?.img_url || "",
        },
        containing_frame: {
          name: cs.containing_frame?.name || "",
          nodeId: cs.containing_frame?.nodeId || "",
          pageId: cs.containing_frame?.pageId || "",
          pageName: cs.containing_frame?.pageName || "",
          backgroundColor: cs.containing_frame?.backgroundColor || "",
        },
        link: `https://www.figma.com/file/${cs.file_key}/?node-id=${encodeURIComponent(cs.node_id)}`,
      }));

      return {
        result: rows,
        continuation: cursor ? { after: cursor.after } : undefined,
      };
    },
  },
});

// Sync table for team projects
// NOTE: Requires Figma Projects API approval (submitted 2025-09-17)
// Will return 404 until API access is approved by Figma
pack.addSyncTable({
  name: "TeamProjects",
  description: "Get a list of all projects from a Figma team (Requires Projects API approval)",
  identityName: "TeamProject",
  schema: ProjectsSchema,
  formula: {
    name: "SyncTeamProjects",
    description: "Syncs all projects from a Figma team",
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "teamUrl",
        description: "Your Figma team URL (e.g., https://www.figma.com/files/team/123456789)",
      }),
    ],
    execute: async function ([teamUrl], context) {
      // Extract team ID from URL using the same regex pattern as TeamComponents
      const regex = /https:\/\/www\.figma\.com\/files\/(?:\d+\/)?team\/(\d+)/;
      const matches = teamUrl.match(regex);
      const teamId = matches ? matches[1] : null;

      if (!teamId) {
        throw new coda.UserVisibleError("Invalid team URL format. Please provide a valid Figma team URL like: https://www.figma.com/files/team/123456789");
      }

      // Build API URL (Projects API doesn't have documented pagination)
      const url = `https://api.figma.com/v1/teams/${teamId}/projects`;

      let response;
      try {
        response = await context.fetcher.fetch({
          method: "GET",
          url: url,
        });
      } catch (error) {
        if (coda.StatusCodeError.isStatusCodeError(error)) {
          const statusError = error as coda.StatusCodeError;
          const message = statusError.body?.message || statusError.message;

          // Provide specific guidance for 403 errors which may indicate missing scope or limited access
          if (statusError.status === 403) {
            throw new coda.UserVisibleError(`Access denied to team projects. This may be due to: 1) Missing projects:read OAuth scope, 2) Limited API access (Projects API requires approval), or 3) Insufficient team permissions. Error: ${message}`);
          }

          // Handle 404 which commonly indicates Projects API is not approved for this application
          if (statusError.status === 404) {
            throw new coda.UserVisibleError(`Projects API not available. The Figma Projects API requires special approval. Please request access at https://www.figma.com/developers/api#projects-endpoints or contact your Figma administrator. Error: ${message}`);
          }

          throw new coda.UserVisibleError(`Failed to access team projects: ${message}`);
        }
        throw error;
      }

      const projects = response.body.projects || [];

      // Transform API response to match our schema
      const rows = projects.map((p: any) => ({
        id: p.id.toString(),
        name: p.name,
        teamId: teamId,
        fileCount: 0, // Projects API doesn't return file count directly
        created_at: p.created_at || "",
        modified_at: p.modified_at || "",
        link: `https://www.figma.com/files/project/${p.id}`,
      }));

      return {
        result: rows,
        // Projects API doesn't document pagination, so no continuation
      };
    },
  },
});

// Sync table for project files
// NOTE: Requires Figma Projects API approval (submitted 2025-09-17)
// Will return 404 until API access is approved by Figma
pack.addSyncTable({
  name: "ProjectFiles",
  description: "Get a list of all files from a Figma project (Requires Projects API approval)",
  identityName: "ProjectFile",
  schema: ProjectFilesSchema,
  formula: {
    name: "SyncProjectFiles",
    description: "Syncs all files from a Figma project",
    parameters: [
      coda.makeParameter({
        type: coda.ParameterType.String,
        name: "projectId",
        description: "The Figma project ID (get this from the TeamProjects sync table)",
      }),
      coda.makeParameter({
        type: coda.ParameterType.Boolean,
        name: "includeBranchData",
        description: "Include branch metadata for files with branches",
        optional: true,
      }),
    ],
    execute: async function ([projectId, includeBranchData], context) {
      if (!projectId) {
        throw new coda.UserVisibleError("Project ID is required. You can get project IDs from the TeamProjects sync table.");
      }

      // Build API URL with optional branch_data parameter
      let url = `https://api.figma.com/v1/projects/${projectId}/files`;
      if (includeBranchData) {
        url += "?branch_data=true";
      }

      let response;
      try {
        response = await context.fetcher.fetch({
          method: "GET",
          url: url,
        });
      } catch (error) {
        if (coda.StatusCodeError.isStatusCodeError(error)) {
          const statusError = error as coda.StatusCodeError;
          const message = statusError.body?.message || statusError.message;

          // Provide specific guidance for common errors
          if (statusError.status === 403) {
            throw new coda.UserVisibleError(`Access denied to project files. This may be due to: 1) Missing projects:read OAuth scope, 2) Limited API access (Projects API requires approval), or 3) Invalid project ID. Error: ${message}`);
          }
          if (statusError.status === 404) {
            throw new coda.UserVisibleError(`Project not found or Projects API not available. If the project ID is correct, the Figma Projects API may require special approval. Please request access at https://www.figma.com/developers/api#projects-endpoints. Error: ${message}`);
          }

          throw new coda.UserVisibleError(`Failed to access project files: ${message}`);
        }
        throw error;
      }

      const files = response.body.files || [];

      // Transform API response to match our schema
      const rows = files.map((f: any) => ({
        key: f.key,
        name: f.name,
        thumbnail_url: f.thumbnail_url || "",
        last_modified: f.last_modified || "",
        editor_type: f.editor_type || "design",
        projectId: projectId,
        projectName: f.project_name || "", // If available in response
        branches: {
          count: f.branches?.length || 0,
          main_file_key: f.key, // The file itself is the main file
        },
        link: `https://www.figma.com/file/${f.key}`,
      }));

      return {
        result: rows,
        // Projects API doesn't document pagination for files, so no continuation
      };
    },
  },
});

// Card formulas for individual entity lookup

// ComponentCard formula - Get details about a specific component
pack.addFormula({
  name: "ComponentCard",
  description: "Get detailed information about a specific Figma component by its key",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "componentKey",
      description: "The component key from a sync table or Figma URL",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "sourceUrl",
      description: "Team URL or file URL containing the component (optional, helps determine context)",
      optional: true,
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: ComponentsSchema,
  execute: async function ([componentKey, sourceUrl], context) {
    // First try to get component from file context if file URL provided
    if (sourceUrl && (sourceUrl.includes('/file/') || sourceUrl.includes('/design/'))) {
      const fileKeyMatch = sourceUrl.match(/\/(?:file|design)\/([a-zA-Z0-9]+)/);
      if (fileKeyMatch) {
        const fileKey = fileKeyMatch[1];

        try {
          const response = await context.fetcher.fetch({
            method: "GET",
            url: `https://api.figma.com/v1/files/${fileKey}/components`,
          });

          const component = response.body.meta.components.find(c => c.key === componentKey);
          if (component) {
            return {
              key: component.key,
              file_key: component.file_key,
              node_id: component.node_id,
              thumbnail_url: component.thumbnail_url,
              name: component.name,
              description: component.description,
              created_at: component.created_at,
              updated_at: component.updated_at,
              user: component.user,
              containing_frame: component.containing_frame,
              link: `https://www.figma.com/file/${component.file_key}?node-id=${encodeURIComponent(component.node_id)}`,
            };
          }
        } catch (error) {
          // Continue to try team search if file search fails
        }
      }
    }

    // Try team search if sourceUrl is a team URL or file search failed
    if (sourceUrl && sourceUrl.includes('/team/')) {
      const teamIdMatch = sourceUrl.match(/\/team\/(\d+)/);
      if (teamIdMatch) {
        const teamId = teamIdMatch[1];

        try {
          const response = await context.fetcher.fetch({
            method: "GET",
            url: `https://api.figma.com/v1/teams/${teamId}/components`,
          });

          const component = response.body.meta.components.find(c => c.key === componentKey);
          if (component) {
            return {
              key: component.key,
              file_key: component.file_key,
              node_id: component.node_id,
              thumbnail_url: component.thumbnail_url,
              name: component.name,
              description: component.description,
              created_at: component.created_at,
              updated_at: component.updated_at,
              user: component.user,
              containing_frame: component.containing_frame,
              link: `https://www.figma.com/file/${component.file_key}?node-id=${encodeURIComponent(component.node_id)}`,
            };
          }
        } catch (error) {
          if (coda.StatusCodeError.isStatusCodeError(error)) {
            const statusError = error as coda.StatusCodeError;
            const message = statusError.body?.message || statusError.message;
            throw new coda.UserVisibleError(`Failed to search team for component: ${message}`);
          }
          throw error;
        }
      }
    }

    throw new coda.UserVisibleError(`Component with key "${componentKey}" not found. Make sure the component key is correct and you have access to the file or team containing it.`);
  },
});

// StyleCard formula - Get details about a specific style
pack.addFormula({
  name: "StyleCard",
  description: "Get detailed information about a specific Figma style by its key",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "styleKey",
      description: "The style key from a sync table",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "fileUrl",
      description: "File URL containing the style",
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: StylesSchema,
  execute: async function ([styleKey, fileUrl], context) {
    // Extract file key from URL
    const fileKeyMatch = fileUrl.match(/\/(?:file|design)\/([a-zA-Z0-9]+)/);
    if (!fileKeyMatch) {
      throw new coda.UserVisibleError("Invalid file URL format. Please provide a valid Figma file URL.");
    }

    const fileKey = fileKeyMatch[1];

    let response;
    try {
      response = await context.fetcher.fetch({
        method: "GET",
        url: `https://api.figma.com/v1/files/${fileKey}/styles`,
      });
    } catch (error) {
      if (coda.StatusCodeError.isStatusCodeError(error)) {
        const statusError = error as coda.StatusCodeError;
        const message = statusError.body?.message || statusError.message;
        throw new coda.UserVisibleError(`Failed to fetch styles from file: ${message}`);
      }
      throw error;
    }

    const style = response.body.meta.styles.find(s => s.key === styleKey);
    if (!style) {
      throw new coda.UserVisibleError(`Style with key "${styleKey}" not found in the specified file.`);
    }

    return {
      key: style.key,
      file_key: style.file_key,
      node_id: style.node_id,
      style_type: style.style_type,
      thumbnail_url: style.thumbnail_url,
      name: style.name,
      description: style.description,
      created_at: style.created_at,
      updated_at: style.updated_at,
      sort_position: style.sort_position,
      user: style.user,
      link: `https://www.figma.com/file/${style.file_key}?node-id=${encodeURIComponent(style.node_id)}`,
    };
  },
});

// ComponentSetCard formula - Get details about a specific component set
pack.addFormula({
  name: "ComponentSetCard",
  description: "Get detailed information about a specific Figma component set by its key",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "componentSetKey",
      description: "The component set key from a sync table",
    }),
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "fileUrl",
      description: "File URL containing the component set",
    }),
  ],
  resultType: coda.ValueType.Object,
  schema: ComponentSetsSchema,
  execute: async function ([componentSetKey, fileUrl], context) {
    // Extract file key from URL
    const fileKeyMatch = fileUrl.match(/\/(?:file|design)\/([a-zA-Z0-9]+)/);
    if (!fileKeyMatch) {
      throw new coda.UserVisibleError("Invalid file URL format. Please provide a valid Figma file URL.");
    }

    const fileKey = fileKeyMatch[1];

    let response;
    try {
      response = await context.fetcher.fetch({
        method: "GET",
        url: `https://api.figma.com/v1/files/${fileKey}/component_sets`,
      });
    } catch (error) {
      if (coda.StatusCodeError.isStatusCodeError(error)) {
        const statusError = error as coda.StatusCodeError;
        const message = statusError.body?.message || statusError.message;
        throw new coda.UserVisibleError(`Failed to fetch component sets from file: ${message}`);
      }
      throw error;
    }

    const componentSet = response.body.meta.component_sets.find(cs => cs.key === componentSetKey);
    if (!componentSet) {
      throw new coda.UserVisibleError(`Component set with key "${componentSetKey}" not found in the specified file.`);
    }

    return {
      key: componentSet.key,
      file_key: componentSet.file_key,
      node_id: componentSet.node_id,
      thumbnail_url: componentSet.thumbnail_url,
      name: componentSet.name,
      description: componentSet.description,
      created_at: componentSet.created_at,
      updated_at: componentSet.updated_at,
      user: componentSet.user,
      containing_frame: componentSet.containing_frame,
      link: `https://www.figma.com/file/${componentSet.file_key}?node-id=${encodeURIComponent(componentSet.node_id)}`,
    };
  },
});

// Export the pack (required)
export default pack;