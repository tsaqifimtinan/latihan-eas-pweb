import { CollectionConfig } from 'payload/types'

const Chats: CollectionConfig = {
  slug: 'chats',
  admin: {
    useAsTitle: 'id',
  },
  fields: [
    {
        name: 'senderID',
        type: 'text',
        required: true,
        defaultValue: ({ user }) => user.id,
    },
    {
        name: 'groupID',
        type: 'text',
        required: true,
    },
    {
        name: 'content',
        type: 'textarea',
        required: true,
    }
  ]
}

export default Chats