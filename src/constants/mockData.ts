export type Review = {
  rating: number;
  comment: string;
};

export type AmazonProduct = {
  asin: string;
  title: string;
  slug: string;
  rating: number;
  aboutThisItem: string;
  reviews: Review[];
};

export const amazonProducts: AmazonProduct[] = [
  {
    asin: "B0BC1DVHSD",
    title:
      "RAEMAO Massage Gun, Muscle Massage Gun with High-tech Brushless Motor, Attaching 15 PCS Upgrade Replacement Heads, Quite Deep Tissue Massager, Carbon",
    slug: "RAEMAO-High-tech-Brushless-Attaching-Replacement",
    rating: 4.7,
    aboutThisItem: `【Efficient & Various】12mm deep tissue massage has 10 different speed modes, and 15 special massage heads are equipped for different muscle groups, which up to 3200rpm to relieving muscle stiffness and soreness, promote blood circulation.
    【Special Design & Silent Massager】This muscle massage gun deep tissue adopts ergonomic design so it is more in line with people's use habits, easy to grip and use. In addition, it featuring powerful brushless motor as low as 40db, which protect your privacy and ideal for you using at home or office.
    【Smart LCD Screen】 The massage gun is equipped with an LCD intelligent touch screen. Touch the middle of the screen to adjust the speed easily to meet your fitness and relaxation needs. The power percentage is displayed on the screen, so that you can clearly see the battery remaining. RAEMAO is committed to creating a happy and intelligent experience for you.
    【Considerate Battery Design】Excellent battery life & 10min Auto-off Protection: It can work for 5 hours (varied for the speed selected). After 10 minutes of continuous use, the percussion massager will automatically stop running, providing intimate protection for your health and effectively protecting battery life.
    【Easy Carry】Exquisite Lightweight designed RAEMAO massage gun include carrying case, USB charging cable (without Charging Plug ) and user manual, simplified storage and transportation, is the best Mother's Day and Father's Day gift for family, lovers and friends.`,
    reviews: [
      {
        rating: 5,
        comment: `This thing is A W E S O M E. No, wait…it is, in fact, supercalifragilisticexpialidocious awesomeness !! I bought it because I had given up on chiropractic (the last one I went to is a scamming p.o.s., which turned me off from that type of care), and was willing to do almost anything to just make it stop. I hadn’t slept well in years, I was constantly tired and irritable and unpleasant to be around because of my neck stiffness and pain. Anyway, I figured it would be at least as good as the aforementioned “doctor of chiropractic” and I wouldn’t be shelling out money feeling exactly like I did when I got there and wouldn’t have to hear “…that’ll be $35, please…” again. If you decide to go ahead, a couple of pointers, if I may:
        First time charging it, it will very likely drop immediately to 80% or something…don’t freak; just charge it again, use it, charge it, etc., and the battery will get trained and it should last a good while.
        Secondly, be consistent. If, like me, you’re suffering, it probably took a while for your body to get locked up and painful, so this will not give instant healing. Look into a far-infrared heating pad because they’re also incredible things in their own right and they really do work better than those old things one can grab at the store for $20. Because science. Use that in tandem with this and, if you’re as desperate as I was, look into an inexpensive, inflatable neck traction device. I scored mine for about $20, and despite the color (royal purple, no less), I can’t remember the last time I slept for eight solid hours without waking up in pain.
        
        Good luck!`,
      },
      {
        rating: 5,
        comment: `I love this massager and feel it was built very well compared to others. I have bought 2 before locally and they died right away and returned them. This one I've had for a month now and it's great, comes with a nice case. Easy to use and touchscreen to adjust power levels. when pressing against your muscles it will kick on a power mode that's strong.

        The RAEMAO Electric Massager is an excellent choice for anyone looking to alleviate muscle pain and tension. The percussion technology provides deep tissue massage, helping to improve blood flow and reduce discomfort. The product is designed to be comfortable and easy to use, with a ergonomic handle that fits comfortably in the hand. The various speed and intensity settings allow you to customize your massage experience, making it suitable for people with different needs and preferences.
        
        One of the key benefits of this massager is its portability. It is compact and lightweight, making it easy to take with you on-the-go or use at home. Whether you are an athlete who needs to recover after a workout, or someone who spends long hours sitting at a desk, this massager is a great tool to help you feel refreshed and relaxed.
        
        In terms of performance, the RAEMAO Electric Massager delivers great results. The percussion technology is effective at reaching deep into the muscle tissue, providing a thorough and invigorating massage. The different speed and intensity settings allow you to tailor your massage experience to your needs, whether you prefer a light and soothing massage or a deep and invigorating one.
        
        The product is also well-made and durable, with high-quality materials that are built to last. It is easy to clean and maintain, and comes with a convenient carrying case that makes it easy to transport.
        
        In conclusion, the RAEMAO Electric Massager is an excellent product that delivers great results. It is portable, comfortable to use, and effective at relieving muscle pain and tension. Whether you are an athlete, gym-goer, or just someone in need of a good massage, this product is a great choice. I highly recommend it to anyone looking for a quality massage tool.`,
      },
      {
        rating: 5,
        comment:
          "I admit, was a wee bit skeptic but was willing to try and I have no regrets. Cost less than seeing a chiropractor who usually only does a minor adjustment. Owning this tool has saved me money and time. Tool does have a set timer but all you have to do is restart and begin timer over. I love the fact it also came with other adapter heads to be used for different applications. Adapter heads are easy to change in and out and comes in their own net mesh drawstring bag that sits inside the case the tool comes in. USB rechargeable and does not take long to be fully charged. Will be purchasing more for my grown kids as a Christmas gifts soon. Cheers!",
      },
      {
        rating: 5,
        comment: `I’m no pro athlete so here’s an average persons review.

        1. Actually massages. It’s not a high powered vibrating gun but it actually oscillates in and out where it’s actually working the tissue.
        
        2. Lots of different attachments and easy guide on where to use them.
        
        3. We use it often and the battery life is excellent.
        
        4. Only drawback is it’s rather large to hold the handle. I have an average sized female hand so when using it I find myself using both hands to hold it bc my hand gets tired or I can’t hold it well.
        
        5. Carrying case is a huge plus!
        
        Sometimes I get pains in my legs or they feel restless. I just use the general hall attachment up and down both legs on both sides and it actually makes it go away. So, I don’t have to take ibuprofen. That’s probably been my fav thing so far about this item.`,
      },
      {
        rating: 5,
        comment: `My wife and I love this thing and have recommended it to many. It offers a great massage with virtually no effort. I use it on my arthritic thumbs and my wife has been using it on my back a lot. It's great on calves and thighs after workouts. Generally the lower impact settings are all we need. The huge assortment of attachments allows you to find the perfect tool for each body part. Battery life is outstanding at about an hour and it recharges quickly. Surprisingly, our cat also loves it and stands in line for her turn, the dog is ambivalent.`,
      },
      {
        rating: 4,
        comment: `I truly would recommend this product. While it doesn’t take away pain/muscle tightness completely it does provide some relief. I use it every night after work. As expected some areas are hard to reach and not so relaxing if you’re in your own, but if you can find someone convince them to give you a 5 min back massage. It’s possible to do your neck but would feel better having someone else do it. I haven’t used all of the accessories and perhaps will test them out some day but what I have used has done the job.
        I gave only 4 stars but this is really because I would have liked something that gave a more ‘hammering’ option to break up this really tight knots.`,
      },
      {
        rating: 4,
        comment: `I feel better after rubbing out the sore muscles from exercising. My husband has neuropathy and using the massager help his circulation. I find that replacing the "heads" on it is difficult, but at least I know they will not fall off while using. The charge percentage is not accurate - so depending on how long you use it each time, you need to calculate that it only runs for about 40 minutes before needing re-charging. I hope the battery life is long to allow for lots of re-charging as it really is a pain reliever.`,
      },
      {
        rating: 4,
        comment: `Works great! I like that it comes with different attachments to use for different muscle areas. It’s a great buy for the money.

        *The only thing it’s missing is the USB Plug in to charge the battery. We tried our old phone charger usb plug in adapter but it must draw a lot of power because it got very hot. So we are trying to find a better usb plug in to use.`,
      },
      {
        rating: 4,
        comment: `I love the case and compactness of it. It has a lot of attachments, though, all hard plastic which bruised me when I used it. There are all these speed setting or strength, but they are mostly all the same, fast and really fast. It feels very solid, seems like good quality build, it is simple to figure out and use. It is difficult to get the pressure I need without making it go way too fast because if you press harder the speed at which it pulses jumps instantly to a much faster speed then I set it on. Not sure it this is a manufacturer issue or a design flaw, either way, not good. Overall though it works well and I will keep it. I definitely would recommend switching to softer material for the attachments, they are very hard plastic with no wrap or cushion and just cause bruising, so basically useless due to the speed pressure issue and material. But even with just the original ball attachment I would say itš pretty useful, for 69$`,
      },
      {
        rating: 3,
        comment: `Purchased this as an alternative to TENS. Great choice for me! This model came with quite a few attachments, but NO names or information for the use of each attachments. The first attachment got stuck and I ordered a replacement device. Fortunately YOUTUBE has videos that helped me resolve this issue and I was able to return the replacement unopened. Would be nice if instructions came with precise instructions on how to attach and troubleshoot stuck (only happened because of newness). I was so afraid that I would break it trying to get it unstuck before YOUTUBE video. That aside this was one of my best purchases, especially for the extreme price reduction. I would have NEVER looked at purchasing this for $300! Pleasant surprise was using this for my migraine and facial pain symptoms! No meds, just did this on 3 with the black ball attachment (neck and cheek). Will update later as I am wondering about the frequency to recharge the batter. I usually use it on the 2nd highest setting. Would help if we could LOCK it to keep from accidentally turning it off during rotation.`,
      },
      {
        rating: 3,
        comment: `The tool was well made, great accessories, and design, minus one key feature which was extremely important for me. Although it has multiple power/strength settings, the actual massage functions do not operate fully unless you add a decent amount of pressure. You might think this isn’t that big of deal, but compared to other massage guns, that significantly affects the experience. It can start to feel like more of a workout by applying the pressure, or inconsistent when receiving the massage (which is why it was purchased in the first place)

        Couldn’t find any notes on this, but would recommend an option/product that has consistent pressure, regardless of how hard you push.`,
      },
      {
        rating: 3,
        comment: `Got this for my BF and he really likes it. Its veryyyy intense and direct at the pressure point you have it on. Haven't had any problems yet. I read a lot of reviews of many madsage guns and its like the battery just stops working all together after a few uses... And the battery dies very quick when your using it. The higher the settings the faster it dies. Plenty of assorted pieces though. That was nice. But we really only use 4 of them. They're used to get other pin pointed pressure points`,
      },
      {
        rating: 2,
        comment: `So I suffer from sciatica and degenerative disk and the pain is horrific. My chiropractor recommended getting something like this to help alleviate some of the tightness and relieve the pain. After doing research and looking around I settled on this one, I almost wish I would've kept looking for a couple of reasons, battery life and it stops working for no reason.

        Pros - It came fairly quickly and has lots of different tips for lots of different areas.
        It has a nice little carrying case that is super convenient for either storage &/or travel.
        The handle on it is pretty easy to hold and makes it easy to use.
        The display is pretty straightforward and you can tell what speed, strength and battery life is left.
        It isn't super heavy making it difficult to use by yourself.
        
        Cons - Battery life is AWFUL! It came with 50% battery and I used it for maybe 10 minutes before it completely died.
        While using it, it will just die for no reason at all...just stop in the middle of whatever you're doing no matter what the battery life says it's at. This has happened almost every time I have used it.
        The charging cord is very short so be prepared to have a spot right next to an outlet for charging.
        It only comes with the cord and no adaptor.
        
        **I did reach out to the seller to try and see if there was something to be done, hoping maybe this one is just a bad one because that happens, but I haven't heard back. Will update this if/when the seller contacts me with a resolution.**`,
      },
      {
        rating: 2,
        comment: `I have used other massage guns in the past and really liked them so I decided to buy this one on sale. With this massage gun there are a variety of speeds but when you apply it on your muscles in order for it to hit at more intensity you have to push harder for it to engage the increased power. ( it’s hard to explain) So for example if you put the massage gun on any level (let’s say three for example) it seems to have 2 modes for level three where it’s moving soft and when you apply it to your muscles you can feel it but it’s not intense, in order to really feel it on level three you have to push down with force in order to get it to engage into the deeper level three. In other words there seems to be two modes in each level. I don’t know if this feature is to save battery or if I had one that was defective. But the more expensive ones I’ve used in the past you don’t have to apply much pressure if any to get it to the full force of any level, it’s just Instant power. With this massaging gun I had to push so hard in order to really engage its effectiveness that my arms would get tired.`,
      },
      {
        rating: 1,
        comment: `I read a few reviews about how it stopped working after a few charges, but I decided to give it try since it was on sale. I wish I would have listened to the reviews. We used it a few times and charged it once and everything was going great, what a deal I thought! Well the second time I tried to charge it, it would not come on at all after showing it was fully charged. Now I cannot get it to turn on or do anything. I tried using another outlet to charge and it wont even show the charge percentage. Completely dead. I tired to get in touch with customer service, but I do not see where there is contact information.`,
      },
      {
        rating: 1,
        comment: `I had high hopes when I bought this massager. It is not cheap, so I assumed that it would be a solid, reliable product.
        1. It shuts itself off randomly, frequently, sometimes after as little as two or three minutes. This makes it very annoying, needing to continually restart it.
        2. The battery life is shockingly short, going from 100% to flat-dead after about two hours of use. Once dead, it takes approximately 5 hours to reach a full charge again.
        3. It does not maintain steady speed from minute to minute. For instance, if set on the lowest of the 10 settings, it will fluctuate between the lower three or four speeds. Again, very annoying.`,
      },
    ],
  },
  {
    asin: "B0BMKD1HG7",
    title:
      "RENPHO Massage Gun with Heat and Cold Head, Muscle Massage Gun Deep Tissue for Athletes, Handheld Deep Tissue Massager Gun with Carry Case, Body Massager for Neck and Back Pain Relief, Gifts for Him",
    slug: "RENPHO-Massage-Athletes-Handheld-Massager",
    rating: 4.7,
    aboutThisItem: `Powerful Massage Gun Deep Tissue -- We are dedicated to offering a more exquisite and intense sports massage gun for back pain; With premium metal housing and a super powerful brushless motor, the RENPHO New muscle massage gun delivers depth high penetration reaches and massages muscle tissue 10mm depth, better relieve muscle fatigue and pain.
    1 Heating and Cooling Head & 4 Standard Massage Heads - Renpho Massage Gun comes with a heating and cooling massage head that can heat up to 131°F (55°C) or cool down to 61 ℉（8°C） for deeper muscle relaxation and stress relief. Choose from 4 standard massage heads to relax your body by targeting different muscle groups.
    15W PD Fast Charging & Type C Charging -- Supports 15W PD Fast Charging, fully charging just needs 1.5-2 hours while the normal model needs at least 4 hours. Powered by 5X longer cycle rechargeable battery, the RENPHO upgrade deep tissue massage gun can be charged by A-C or C-C Cable. Fast charging anytime, anywhere for portable use.
    Up to 3200rpm(5 speeds) & Super-quiet design: 5 speeds from 1800 to 3200rpm are provided for different muscle groups, aiding in sore muscle massage, relaxing and shaping different muscle parts; 40dB to blend in with ambient sounds, the percussion massage gun offers you an enjoyable and quiet massage experience
    Ultra-Silent Ergonomics Deep Tissue Muscle Massage Gun-- Perfect massage gun for athletes' hand back Leg workouts. Built-in a super quiet brushless motor, as low as 40db, brushless motor life is almost 50X longer than brush motor life. Weighted only 1.5 lbs, this percussion massager gun is ultra-compact and easy to grip, making it ideal for home, office or gym use anytime.`,
    reviews: [
      {
        rating: 5,
        comment:
          "I've had the massage gun from Sharper Image for a couple of years, but wanted a second one...one for home and one for my office. I found this one and decided to give it a try. The SI gun didn't have an air cushioned head, and I was wanting one with that particular attachment. I've used this Renpho gun for over a week now, and it's perfect. It's small, yet more powerful than my other gun. I highly recommend this product!",
      },
      {
        rating: 5,
        comment:
          "I used to have another massage gun. It was bigger and more difficult yo hold and use. This one is smaller and I like it. It's been good for massaging my legs when they cramp up.",
      },
      {
        rating: 5,
        comment:
          "I like the different attachments as well as the case it comes in. I was shocked to find I could easily hold it over my shoulders and reach spots I needed. Very powerful. Recommend.",
      },
      {
        rating: 5,
        comment:
          "Very happy with this message gun. Helped to relieve the knots in my lower back. Good value!",
      },
      {
        rating: 5,
        comment:
          "The power of the battery charged hand massager is unreal. It will pulverize any stiff muscle you might have! Nobody told me to write this, I just wanted to because it’s absolutely true. Definitely worth a present or gift, for someone you care about, and that means you too.",
      },
      {
        rating: 4,
        comment:
          "Got this to help with my lower back and now I'm getting back into the gym a bit, and this little guy here is very nice to use for sore muscles. The case is very nice and the layout in the case works great for keeping it organized. Recommended",
      },
      {
        rating: 4,
        comment:
          "The machine itself works every bit as good as my Takata 300 dollar machine. His attachments definitely feel of nicer quality, but this does the job it is intended to do every bit as good as the more expensive options. Great buy for the price! Under 50 bucks is a steal!",
      },
      {
        rating: 4,
        comment:
          "I can’t attach the attachments or if I finally I do it’s imposible for me to take them out from the machine. Other wise the power, the battery life , the quietness, and easy to hold it’s excellent.but I can exchange them often that I need.",
      },
      {
        rating: 4,
        comment:
          "It arrived promptly. I plugged it in to charge it according to directions and it was already 3/4 charged. That made me wonder if it had been returned by someone else. It seems to wrok well. I haven't had it long enough to evaluate the battery life. I found the directions to be somewhat lacking. I kept trying to screw the heads in when all they needed was to be pushed in.",
      },
      {
        rating: 3,
        comment:
          "This little massage gun is pretty sweet and handles the every day knots and sore muscles well",
      },
      {
        rating: 3,
        comment:
          "I used this for quite some time but realized that the theragun which was double the price was a bit better. The delta may not justify the price but I think I wanted to go with something branded if I'm going to use it regularly",
      },
      {
        rating: 3,
        comment:
          "It arrived quickly but it’s a Christmas present so no feedback on anything else.",
      },
      {
        rating: 1,
        comment:
          "The battery will die within 15 minutes of continuous use. The speed settings are not the comfortable Because it will either run slow and hard or too fast altogether to be comfortable. The handle is not designed for you to use it on your own for places like your back being most peoples key area that they want to address.",
      },
      {
        rating: 1,
        comment:
          "Works for 10 seconds, then stops. Even fully charged. Don’t bother",
      },
    ],
  },
];
