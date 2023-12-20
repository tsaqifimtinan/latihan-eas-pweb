import { CollectionConfig } from 'payload/types'

const Groups: CollectionConfig = {
  slug: 'groups',
  admin: {
    useAsTitle: 'id',
  },
  access: {
    create: () => true,
    read: () => true,
  },
  fields: [
    {
      name: 'groupName',
      type: 'text',
      required: true
    },
    {
      name: 'memberOne',
      type: 'text',
      required: true
    },
    {
      name: 'memberTwo',
      type: 'text',
      required: true 
    }
  ]
}

export default Groups