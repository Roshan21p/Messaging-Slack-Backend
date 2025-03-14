import mongoose, { mongo } from "mongoose";

const workspaceSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Workspace name is required'],
            unique: true
        },
        description: {
            type: String
        },
        members: [
            {
                memberId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                },
                role: {
                    type: String,
                    role: ['member', 'admin'],
                    default: 'member'
                }
            }
        ],
        joinCode: {
            type: String,
            required: [true, 'Join code is required']
        },
        channels: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Channel'
            }
        ]
    }
);

const Workspace = mongoose.model('Workspace', workspaceSchema);

export default Workspace;