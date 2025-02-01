// import { combineResolvers } from 'graphql-resolvers';

import { GetAllTemplates, GetDetailTemplate } from '../../../services';
// import { checkAuthorization } from '../../libs';

export default {
  Query: {
    get_all_templates: () => GetAllTemplates('dynamic') || [],
    get_detail_template: (_, t) => GetDetailTemplate(t.template_id)
  }
};
