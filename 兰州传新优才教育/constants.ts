import { AppData } from './types';

export const DEFAULT_DATA: AppData = {
  config: {
    name: "兰州优才教育",
    logoUrl: "https://via.placeholder.com/150x50?text=Youcai+Edu",
    footerText: "© 2024 兰州优才教育. All Rights Reserved. 陇ICP备88888888号",
    loginBackgroundUrls: [
      "https://picsum.photos/1920/1080?random=10",
      "https://picsum.photos/1920/1080?random=11",
      "https://picsum.photos/1920/1080?random=12"
    ],
    contact: {
      phone: "0931-12345678",
      address: "兰州市城关区庆阳路88号",
      email: "contact@youcai.edu.cn",
      wechat: "lz_youcai_edu"
    }
  },
  home: {
    title: "优才教育，成就未来",
    subtitle: "专注中小学培优，打造兰州顶尖教育品牌",
    imageUrls: [
      "https://picsum.photos/1920/600?random=1",
      "https://picsum.photos/1920/600?random=2",
      "https://picsum.photos/1920/600?random=8"
    ],
    advantages: [
      "省内名师授课，教学质量有保障",
      "小班制教学，关注每一位学生",
      "科学的课程体系，精准提分",
      "舒适的教学环境，学习更高效"
    ]
  },
  campuses: [
    {
      id: "c1",
      name: "城关总校区",
      address: "兰州市城关区庆阳路88号",
      description: "位于市中心核心地段，交通便利，拥有现代化多媒体教室30余间。",
      imageUrl: "https://picsum.photos/600/400?random=1",
      facilities: ["多媒体教室", "图书角", "家长休息区"]
    },
    {
      id: "c2",
      name: "安宁分校区",
      address: "兰州市安宁区安宁西路66号",
      description: "毗邻大学城，学术氛围浓厚，专注于高中竞赛辅导。",
      imageUrl: "https://picsum.photos/600/400?random=2",
      facilities: ["实验室", "自习室", "餐厅"]
    }
  ],
  achievements: [
    {
      id: "a1",
      studentName: "张三",
      title: "考入清华大学",
      description: "在2023年高考中以全省前十名的优异成绩被清华大学录取。",
      category: "升学",
      imageUrl: "https://picsum.photos/400/300?random=3"
    },
    {
      id: "a2",
      studentName: "李四",
      title: "数学竞赛省一等奖",
      description: "经过一年的系统培训，获得全国高中数学联赛省级一等奖。",
      category: "竞赛",
      imageUrl: "https://picsum.photos/400/300?random=4"
    }
  ],
  faculty: [
    {
      id: "f1",
      name: "王老师",
      title: "金牌数学教练",
      bio: "毕业于北京师范大学数学系，从事高中数学竞赛辅导15年，所带学生多人获得金银牌。",
      yearsOfExperience: 15,
      tags: ["特级教师", "竞赛专家"],
      imageUrl: "https://picsum.photos/200/200?random=5"
    },
    {
      id: "f2",
      name: "刘老师",
      title: "资深英语讲师",
      bio: "英语专业八级，授课幽默风趣，擅长激发学生学习兴趣，平均提分30+。",
      yearsOfExperience: 8,
      tags: ["海归硕士", "口语专家"],
      imageUrl: "https://picsum.photos/200/200?random=6"
    }
  ],
  about: {
    history: "优才教育成立于2010年，历经十余年发展，已成为兰州地区知名的中小学课外辅导机构。",
    philosophy: "以学生为中心，以质量求生存，以口碑谋发展。",
    values: "诚信、专业、责任、创新",
    certImageUrls: ["https://picsum.photos/300/400?random=7"]
  }
};