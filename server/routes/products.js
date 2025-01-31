const router = require(`express`).Router()

let products =
    [
        {
            productId: "P001",
            name: "Fender Player II Strat RW 3TS",
            description: "Classic electric guitar with three single-coil pickups",
            price: 815,
            images: ["https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/_59/595227/19267253_800.jpg"],
            rating: 3,
            category: "Guitars",
            subcategory: "Electric Guitars",
            brand: "Fender",
            stock: 4,
            specifications: {
                body: "Alder",
                neck: "Maple",
                fingerboard: "Maple",
                pickups: "3 single-coil"
            }
        },
        {
            productId: "P002",
            name: "Gibson Les Paul Standard",
            description: "Iconic electric guitar with a solid mahogany body and humbucker pickups",
            price: 2499.99,
            images: ["https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/_46/462509/18203706_800.jpg"],
            category: "Guitars",
            subcategory: "Electric Guitars",
            brand: "Gibson",
            stock: 0,
            specifications: {
                body: "Mahogany",
                neck: "Mahogany",
                fingerboard: "Rosewood",
                pickups: "2 humbuckers"
            }
        },
        {
            productId: "P003",
            name: "Yamaha P-125 Digital Piano",
            description: "Portable digital piano with 88 weighted keys and rich stereo sound",
            price: 649.99,
            images: ["https://sc1.musik-produktiv.com/pic-010141616xl/yamaha-p-125-b-home-set.jpg"],
            category: "Keyboards & Pianos",
            subcategory: "Digital Pianos",
            brand: "Yamaha",
            stock: 20,
            specifications: {
                keys: "88 fully weighted",
                polyphony: "192 notes",
                speakers: "2 x 7W",
                features: "Smart Pianist app compatibility"
            }
        },
        {
            productId: "P004",
            name: "Pearl Export EXX Drum Set",
            description: "Complete 5-piece drum set with shells, hardware, and cymbals",
            price: 799.99,
            images: ["https://r2.gear4music.com/media/54/546333/600/preview_1.jpg"],
            category: "Drums & Percussion",
            subcategory: "Acoustic Drum Kits",
            brand: "Pearl",
            stock: 8,
            specifications: {
                shellMaterial: "Poplar/Asian mahogany",
                configuration: "5-piece",
                cymbals: "Sabian SBR series",
                hardware: "Includes drum throne"
            }
        },
        {
            productId: "P006",
            name: "Martin D-28 Acoustic Guitar",
            description: "Legendary dreadnought acoustic guitar with exceptional tone and craftsmanship",
            price: 2999.99,
            images: ["https://www.waltons.ie/wp-content/uploads/2023/11/martin-D28.jpg"],
            category: "Guitars",
            subcategory: "Acoustic Guitars",
            brand: "Martin",
            stock: 3,
            specifications: {
                body: "Solid Sitka Spruce top, East Indian Rosewood back and sides",
                neck: "Select Hardwood",
                fingerboard: "Ebony",
                scaleLength: "25.4 inches"
            }
        },
        {
            productId: "P007",
            name: "Boss Katana-50 MkII Guitar Amplifier",
            description: "50-watt combo amp with versatile tones and onboard effects",
            price: 269.99,
            images: ["https://itmusic.ie/cdn/shop/products/img_gallery_50_01_large.jpg?v=1572941303"],
            category: "Amplifiers",
            subcategory: "Guitar Amplifiers",
            brand: "Boss",
            stock: 30,
            specifications: {
                power: "50 watts",
                speakers: "12-inch custom",
                effects: "60+ BOSS effects",
                channels: "5 selectable amp characters"
            }
        },
        {
            productId: "P009",
            name: "Korg Minilogue XD Analog Synthesizer",
            description: "4-voice analog synthesizer with digital multi-engine and effects",
            price: 649.99,
            images: ["https://b2942189.smushcdn.com/2942189/wp-content/uploads/2023/01/b68e33ce60366c49b6ed211f9e3410c5_pc.png?lossy=1&strip=1&webp=1"],
            category: "Synthesizers",
            subcategory: "Analog Synthesizers",
            brand: "Korg",
            stock: 12,
            specifications: {
                voices: "4-voice polyphony",
                oscillators: "Analog VCOs + digital multi-engine",
                effects: "Reverb, delay, modulation",
                controls: "16-step sequencer, motion sequencing"
            }
        },
        {
            productId: "P010",
            name: "Zildjian A Custom Cymbal Pack",
            description: "Premium cymbal set with brilliant finish and versatile sound",
            price: 899.99,
            images: ["https://sc1.musik-produktiv.com/pic-010079403l/zildjian-a-custom-medium-a20579-11-box-14-16-18-20.jpg"],
            category: "Drums & Percussion",
            subcategory: "Cymbals",
            brand: "Zildjian",
            stock: 10,
            specifications: {
                contents: "14-inch hi-hats, 16-inch crash, 20-inch ride",
                material: "Cast bronze",
                finish: "Brilliant",
                tone: "Bright, crisp, and clean"
            }
        },

        {
            productId: "P011",
            name: "Taylor 214ce Grand Auditorium Acoustic Guitar",
            description: "Versatile acoustic-electric guitar with solid Sitka spruce top and layered rosewood back and sides",
            price: 1199.99,
            images: ["https://r2.gear4music.com/media/108/1082484/600/preview.jpg"],
            category: "Guitars",
            subcategory: "Acoustic-Electric Guitars",
            brand: "Taylor",
            stock: 6,
            specifications: {
                body: "Solid Sitka Spruce top, layered Rosewood back and sides",
                neck: "Tropical Mahogany",
                fingerboard: "Ebony",
                electronics: "Taylor ES2 System"
            }
        },
        {
            productId: "P012",
            name: "Nord Stage 4 88 Keyboard",
            description: "Flagship keyboard with exceptional piano, organ, and synth sounds",
            price: 4999.99,
            images: ["https://assets.nordkeyboards.com/nord-assets-prod/media/original_images/NS4_Compact73_TopDown-01_231020.jpg"],
            category: "Keyboards & Pianos",
            subcategory: "Stage Pianos",
            brand: "Nord",
            stock: 4,
            specifications: {
                keys: "88 fully weighted",
                sections: "Piano, Organ, Synth",
                polyphony: "Unlimited",
                features: "Seamless transitions, OLED display"
            }
        },
        {
            productId: "P013",
            name: "Fender Precision Bass",
            description: "Iconic electric bass with split-coil pickup for deep, punchy tones",
            price: 899.99,
            images: ["https://r2.gear4music.com/media/37/371748/600/preview.jpg"],
            category: "Bass Guitars",
            subcategory: "Electric Bass Guitars",
            brand: "Fender",
            stock: 10,
            specifications: {
                body: "Alder",
                neck: "Maple",
                fingerboard: "Maple",
                pickups: "1 split-coil"
            }
        },
        {
            productId: "P014",
            name: "Tama Imperialstar Drum Kit",
            description: "Affordable 5-piece drum set with cymbals and sturdy hardware",
            price: 599.99,
            images: ["https://sc1.musik-produktiv.com/pic-010150223l/tama-imperialstar-ip52h6w-hbk-hairline-black-22.jpg"],
            category: "Drums & Percussion",
            subcategory: "Acoustic Drum Kits",
            brand: "Tama",
            stock: 9,
            specifications: {
                shellMaterial: "Poplar",
                configuration: "5-piece",
                cymbals: "Meinl HCS Series",
                hardware: "Double-braced"
            }
        },
        {
            productId: "P015",
            name: "Casio Privia PX-S1100",
            description: "Slim and stylish digital piano with Bluetooth audio and 88 weighted keys",
            price: 849.99,
            images: ["https://thumbs.static-thomann.de/thumb/padthumb600x600/pics/bdb/_52/528199/16768724_800.jpg"],
            category: "Keyboards & Pianos",
            subcategory: "Digital Pianos",
            brand: "Casio",
            stock: 18,
            specifications: {
                keys: "88 weighted",
                polyphony: "256 notes",
                connectivity: "Bluetooth audio, MIDI",
                features: "Smartphone app compatibility"
            }
        },
        {
            productId: "P017",
            name: "Ibanez SR500E Electric Bass",
            description: "Lightweight 4-string bass with Bartolini pickups and versatile tone controls",
            price: 799.99,
            images: ["https://r2.gear4music.com/media/73/732907/600/preview.jpg"],
            category: "Bass Guitars",
            subcategory: "Electric Bass Guitars",
            brand: "Ibanez",
            stock: 7,
            specifications: {
                body: "Okoume",
                neck: "5-piece Jatoba/Walnut",
                fingerboard: "Jatoba",
                pickups: "Bartolini BH2"
            }
        },
        {
            productId: "P019",
            name: "Yamaha Revstar RS502T Electric Guitar",
            description: "Unique electric guitar with retro-inspired design and P90 pickups",
            price: 749.99,
            images: ["https://r2.gear4music.com/media/97/974374/600/preview.jpg"],
            category: "Guitars",
            subcategory: "Electric Guitars",
            brand: "Yamaha",
            stock: 8,
            specifications: {
                body: "Mahogany",
                neck: "Mahogany",
                fingerboard: "Rosewood",
                pickups: "2 P90-style"
            }
        },
    ]

// read all items from products JSON
router.get(`/products`, (req, res) => {
    // console.log(req)
    res.json(products)
})

router.get(`/products/:id`, (req, res) => {
    const selectedProduct = products.filter(product => product.productId === req.params.id);
    res.json(selectedProduct[0])
})

module.exports = router