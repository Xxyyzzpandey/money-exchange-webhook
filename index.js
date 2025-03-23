import express from "express"
import {prisma} from "./database/db.js"
import cors from "cors"

const app=express();
app.use(express.json());
app.use(cors())

app.post("/hdfcWebhook", async (req, res) => {
    const paymentinfo=req.body;
    if(!paymentinfo.senderid || !paymentinfo.amount || !paymentinfo.receiverid){
        return res.status(401).json({msg:"credentials are required"});
    }
    let userid=paymentinfo.senderid;
    try {
        const sender = await prisma.balance.findUnique({
            where: { userid: userid }, // Ensure `userid` exists and is unique
          });
      
          if (!sender) {
            return res.status(400).json({ msg: "Sender does not exist." });
          }
          const amount=paymentinfo.amount
          if (sender.amount < amount) {
            return res.status(403).json({ msg: "Sender has insufficient funds." });
          }
      
          userid=paymentinfo.receiverid;
          const receiver = await prisma.balance.findUnique({
            where: { userid: userid },
          });
      
          if (!receiver) {
            return res.status(400).json({ msg: "Receiver does not exist." });
          }

        const transaction = await prisma.$transaction([
            prisma.balance.updateMany({
              where: {
                userid: paymentinfo.senderid,
              },
              data: {
                amount: {
                  decrement: paymentinfo.amount, 
                },
              },
            }),
      
            prisma.Balance.updateMany({
              where: {
                userid: paymentinfo.receiverid,
              },
              data: {
                amount: {
                  increment: paymentinfo.amount,
                },
              },
            }),
            prisma.transation.create({
                data: {
                    amount :paymentinfo.amount,
                    senderid :paymentinfo.senderid,
                    recieverid :paymentinfo.receiverid,
                    data :new Date(),
                    mode :"UPI",                 
                 },
            })
          ]);

        res.status(201).json({
            message: "Captured"
        })
    } catch(e) {
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
    }

})

app.post("/addmoney",async(req,res)=>{
    const info=req.body;
    if(!info.userid || !info.amount){
        return res.status(401).status("credentials are required")
    }
    try{
        
        const sender = await prisma.Balance.findUnique({
            where: { userid: info.userid },
          });
          if(!sender){
            res.status(401).send("user does not exist");
          }
          const transaction = await prisma.$transaction([
          prisma.balance.updateMany({
            where: {
              userid: info.userid,
            },
            data: {
              amount: {
                increment: info.amount, 
              },
            },
          }),
          prisma.transation.create({
            data: {
                amount :info.amount,
                senderid :info.userid,
                recieverid :info.userid,
                data :new Date(),
                mode :"Bank",                 
             },
        })
    ])
     
    return res.status(201).send("transaction successfull")

    }catch(err){
        console.error(e);
        res.status(411).json({
            message: "Error while processing bank payment"
        })
    }
})

app.listen(process.env.PORT,()=>{
  console.log("listening at 3000")
})