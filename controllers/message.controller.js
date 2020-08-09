let User = require("../models/user.model");
let Message = require("../models/message.model");

module.exports.getConversation = async (req, res) => {
    let user = await User.findOne(req.user._id);
    let conversation = user.conversations.find(x => x.user == req.params.id);
    if (conversation) {
        Message.find({
            "_id": {
                $in: conversation.messages
            }
        }, async (err, messages) => {
            let UserB = await User.findOne({ _id: req.params.id }).select("avatar _id fullname")
            let responseObj = {
                messages: messages,
                user: UserB
            }
            conversation.status = true;
            await user.updateOne(user)
            return res.json(responseObj);
        })
    } else {
        let UserB = await User.findOne({ _id: req.params.id }).select("avatar _id fullname")
        let responseObj = {
            messages: [],
            user: UserB
        }
        return res.json(responseObj);
    }
}

module.exports.getAllChatter = async (req, res) => {
    User.findOne({ _id: req.user._id }, (err, result) => {
        result.populate("conversations.user conversations.messages","-restaurants -comments -orders -newfeeds -likes -friends -conversations", (err, docss) => {
            docss.conversations.map(item=>{
                item.message = item.messages.reverse();
                return item;
            });
            docss.conversations = docss.conversations.reverse();
            return res.json(docss.conversations);
        });
    })
}

module.exports.sendMessage = async (req, res) => {
    let message = new Message(req.body);
    message.sender = req.user._id;
    var io = req.app.locals.io;
    await message.save((err, doc) => {
        if (err) return res.json(err);
        doc.save(async (err, result) => {
            if (err) return res.json(err);
            await User.findOne({ _id: result.sender }, async (err, sender) => {
                let check = sender.conversations.find(x => x.user == result.receiver.toString());
                if (check) {
                    check.messages.push(result._id);
                } else {
                    sender.conversations.push({
                        user: result.receiver,
                        messages: [result._id],
                        status: false
                    })
                }
                await sender.updateOne(sender);
            })
            await User.findOne({ _id: result.receiver }, async (err, receiver) => {
                let check = receiver.conversations.find(x => x.user == result.sender.toString());
                if (check) {
                    check.status = false;
                    check.messages.push(result._id);
                } else {
                    receiver.conversations.push({
                        user: result.sender,
                        messages: [result._id],
                        status: false
                    })
                }
                await receiver.updateOne(receiver);
                io.sockets.in(receiver._id).emit("sendMessage", doc);
            });


        })
    })
    return res.json("");
}