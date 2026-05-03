from __future__ import annotations

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import json
import os
from datetime import date
from typing import Any

from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.avatar import DEFAULT_AVATAR_STYLE, build_default_avatar_seed
from app.core.security import hash_password
from app.database import Base, SessionLocal, engine
from app.models.city import City
from app.models.comment import Comment
from app.models.culture_event import CultureEvent
from app.models.post import Post
from app.models.post_reaction import PostReaction
from app.models.user import User
from app.services.embedding_service import generate_embedding


SEED_PASSWORD = os.getenv("HUAXIA_SEED_PASSWORD", "12345678")
RESET_SEED_POSTS = os.getenv("HUAXIA_RESET_SEED_POSTS", "0") == "1"
RESET_CULTURE_EVENTS = os.getenv("HUAXIA_RESET_CULTURE_EVENTS", "0") == "1"


SEED_USERS = [
    {
        "username": "aisha_city",
        "email": "aisha.city@huaxia.local",
        "bio": "International student sharing city arrival notes and practical tips.",
        "gender": "female",
    },
    {
        "username": "omar_wuhan",
        "email": "omar.wuhan@huaxia.local",
        "bio": "Student in China writing about campus life, transport, and documents.",
        "gender": "male",
    },
    {
        "username": "lina_shanghai",
        "email": "lina.shanghai@huaxia.local",
        "bio": "Focused on student budgeting, internships, and big-city survival.",
        "gender": "female",
    },
    {
        "username": "samir_beijing",
        "email": "samir.beijing@huaxia.local",
        "bio": "Writes about university life, academic pressure, and study planning.",
        "gender": "male",
    },
    {
        "username": "fatima_daily",
        "email": "fatima.daily@huaxia.local",
        "bio": "Daily-life advice for new international students in China.",
        "gender": "female",
    },
    {
        "username": "jose_culture",
        "email": "jose.culture@huaxia.local",
        "bio": "Culture, holidays, food, and adaptation notes from student life.",
        "gender": "male",
    },
    {
        "username": "maryam_university",
        "email": "maryam.university@huaxia.local",
        "bio": "University registration, supervisor communication, and study systems.",
        "gender": "female",
    },
    {
        "username": "yusuf_life",
        "email": "yusuf.life@huaxia.local",
        "bio": "Practical guides for paperwork, dorms, payments, and transport.",
        "gender": "male",
    },
]


CITIES = [
    {
        "slug": "wuhan",
        "name": "Wuhan",
        "province": "Hubei",
        "region": "central",
        "lat": 30.5928,
        "lng": 114.3055,
        "description": "Wuhan is the capital of Hubei Province and a major student city in central China. It is known for its universities, river geography, metro system, and lower pressure compared with first-tier cities.",
        "image_url": None,
        "tags": ["student city", "central china", "universities", "metro"],
        "student_summary": "Good for students who want a strong university environment, more affordable daily life than Beijing or Shanghai, and convenient access to central China.",
        "cost_level": "medium",
        "popular_universities": [
            "Hubei University of Technology",
            "Wuhan University",
            "Huazhong University of Science and Technology",
            "Wuhan University of Technology",
        ],
        "highlights": [
            "Capital of Hubei Province",
            "Major university city",
            "Central China transport hub",
            "Useful city for international students in Hubei",
        ],
    },
    {
        "slug": "beijing",
        "name": "Beijing",
        "province": "Beijing",
        "region": "north",
        "lat": 39.9042,
        "lng": 116.4074,
        "description": "Beijing is the capital of China and one of the country’s most important political, cultural, historical, and educational centers.",
        "image_url": None,
        "tags": ["capital", "universities", "history", "culture"],
        "student_summary": "Best for students who want top academic resources, museums, international services, internships, and career exposure, but living costs are high.",
        "cost_level": "high",
        "popular_universities": [
            "Peking University",
            "Tsinghua University",
            "Beijing Normal University",
            "Beijing Foreign Studies University",
        ],
        "highlights": [
            "Capital of China",
            "Strong university concentration",
            "Major cultural and historical center",
            "Higher living cost than many inland cities",
        ],
    },
    {
        "slug": "shanghai",
        "name": "Shanghai",
        "province": "Shanghai",
        "region": "coastal",
        "lat": 31.2304,
        "lng": 121.4737,
        "description": "Shanghai is one of China’s most international cities and a major center for finance, trade, shipping, technology, culture, and higher education.",
        "image_url": None,
        "tags": ["coastal", "international", "finance", "technology"],
        "student_summary": "Best for students who want international exposure, internships, networking, and a fast urban lifestyle. Rent and daily costs require serious budgeting.",
        "cost_level": "high",
        "popular_universities": [
            "Fudan University",
            "Shanghai Jiao Tong University",
            "Tongji University",
            "East China Normal University",
        ],
        "highlights": [
            "International city",
            "Strong public transport",
            "Good internship environment",
            "High living cost",
        ],
    },
    {
        "slug": "chengdu",
        "name": "Chengdu",
        "province": "Sichuan",
        "region": "west",
        "lat": 30.5728,
        "lng": 104.0668,
        "description": "Chengdu is the capital of Sichuan Province and a major western Chinese city known for food culture, universities, pandas, and a more relaxed lifestyle.",
        "image_url": None,
        "tags": ["western china", "food culture", "universities", "pandas"],
        "student_summary": "Good for students who want a large city with a slower pace than Beijing or Shanghai, strong food culture, and western China experience.",
        "cost_level": "medium",
        "popular_universities": [
            "Sichuan University",
            "University of Electronic Science and Technology of China",
            "Southwest Jiaotong University",
            "Southwestern University of Finance and Economics",
        ],
        "highlights": [
            "Capital of Sichuan Province",
            "Strong food culture",
            "Large western China city",
            "Relaxed student lifestyle",
        ],
    },
    {
        "slug": "xian",
        "name": "Xi'an",
        "province": "Shaanxi",
        "region": "west",
        "lat": 34.2583,
        "lng": 108.9286,
        "description": "Xi'an is the capital of Shaanxi Province and one of China’s most important historical cities, connected with ancient Chang’an and Silk Road culture.",
        "image_url": None,
        "tags": ["history", "silk road", "universities", "culture"],
        "student_summary": "Good for students interested in Chinese history, language, culture, archaeology, engineering, and a lower-pressure study environment.",
        "cost_level": "medium",
        "popular_universities": [
            "Xi'an Jiaotong University",
            "Northwestern Polytechnical University",
            "Xidian University",
            "Northwest University",
        ],
        "highlights": [
            "Capital of Shaanxi Province",
            "Ancient city formerly known as Chang’an",
            "Strong cultural learning environment",
            "Useful for students interested in Chinese civilization",
        ],
    },
    {
        "slug": "guangzhou",
        "name": "Guangzhou",
        "province": "Guangdong",
        "region": "south",
        "lat": 23.1291,
        "lng": 113.2644,
        "description": "Guangzhou is the capital of Guangdong Province and one of South China’s major commercial, cultural, educational, and transport centers.",
        "image_url": None,
        "tags": ["south china", "cantonese culture", "trade", "food"],
        "student_summary": "Good for students who want South China exposure, business opportunities, Cantonese culture, food, and access to the Greater Bay Area.",
        "cost_level": "high",
        "popular_universities": [
            "Sun Yat-sen University",
            "South China University of Technology",
            "Jinan University",
            "Guangzhou University",
        ],
        "highlights": [
            "Capital of Guangdong Province",
            "Major Pearl River Delta city",
            "Strong trade and business environment",
            "Known for Cantonese food and culture",
        ],
    },
    {
        "slug": "shenzhen",
        "name": "Shenzhen",
        "province": "Guangdong",
        "region": "south",
        "lat": 22.5431,
        "lng": 114.0579,
        "description": "Shenzhen is a modern southern Chinese city known for technology, innovation, entrepreneurship, and its position near Hong Kong.",
        "image_url": None,
        "tags": ["technology", "innovation", "greater bay area", "modern city"],
        "student_summary": "Best for students interested in technology, entrepreneurship, design, engineering, internships, and a fast modern city environment.",
        "cost_level": "high",
        "popular_universities": [
            "Shenzhen University",
            "Southern University of Science and Technology",
            "The Chinese University of Hong Kong, Shenzhen",
            "Shenzhen MSU-BIT University",
        ],
        "highlights": [
            "Technology and innovation hub",
            "Located near Hong Kong",
            "Good for internship-focused students",
            "High cost of living",
        ],
    },
    {
        "slug": "hangzhou",
        "name": "Hangzhou",
        "province": "Zhejiang",
        "region": "coastal",
        "lat": 30.2741,
        "lng": 120.1551,
        "description": "Hangzhou is the capital of Zhejiang Province and is known for West Lake, technology companies, universities, and digital economy development.",
        "image_url": None,
        "tags": ["zhejiang", "west lake", "technology", "digital economy"],
        "student_summary": "Good for students who want a mix of natural scenery, technology opportunities, universities, and a calmer lifestyle than Shanghai.",
        "cost_level": "high",
        "popular_universities": [
            "Zhejiang University",
            "Hangzhou Dianzi University",
            "Zhejiang University of Technology",
            "Hangzhou City University",
        ],
        "highlights": [
            "Capital of Zhejiang Province",
            "Known for West Lake",
            "Strong technology environment",
            "Balanced city lifestyle",
        ],
    },
    {
        "slug": "nanjing",
        "name": "Nanjing",
        "province": "Jiangsu",
        "region": "coastal",
        "lat": 32.0603,
        "lng": 118.7969,
        "description": "Nanjing is the capital of Jiangsu Province and an important historical and educational city with strong universities and cultural resources.",
        "image_url": None,
        "tags": ["jiangsu", "history", "universities", "ancient capital"],
        "student_summary": "Good for students who want academic seriousness, Chinese history, museums, and East China access without Shanghai-level pressure.",
        "cost_level": "medium",
        "popular_universities": [
            "Nanjing University",
            "Southeast University",
            "Nanjing Normal University",
            "Nanjing University of Aeronautics and Astronautics",
        ],
        "highlights": [
            "Capital of Jiangsu Province",
            "Historic ancient capital",
            "Strong university environment",
            "Good for research-focused students",
        ],
    },
    {
        "slug": "qingdao",
        "name": "Qingdao",
        "province": "Shandong",
        "region": "coastal",
        "lat": 36.0671,
        "lng": 120.3826,
        "description": "Qingdao is a coastal city in eastern Shandong Province known for its port, marine economy, beaches, universities, and coastal lifestyle.",
        "image_url": None,
        "tags": ["coastal", "shandong", "marine science", "port city"],
        "student_summary": "Good for students interested in marine science, engineering, trade, language learning, and a calmer coastal city rhythm.",
        "cost_level": "medium",
        "popular_universities": [
            "Ocean University of China",
            "Qingdao University",
            "China University of Petroleum (East China)",
            "Shandong University Qingdao Campus",
        ],
        "highlights": [
            "Important coastal city",
            "Marine science environment",
            "Port-city lifestyle",
            "Calmer rhythm than first-tier cities",
        ],
    },
    {
        "slug": "tianjin",
        "name": "Tianjin",
        "province": "Tianjin",
        "region": "north",
        "lat": 39.0842,
        "lng": 117.2010,
        "description": "Tianjin is a major northern municipality near Beijing and the Bohai Sea, with universities, port-city history, and access to the Beijing-Tianjin-Hebei region.",
        "image_url": None,
        "tags": ["north china", "municipality", "port city", "near beijing"],
        "student_summary": "Good for students who want North China access and proximity to Beijing without living directly under Beijing-level pressure.",
        "cost_level": "medium",
        "popular_universities": [
            "Tianjin University",
            "Nankai University",
            "Tianjin Medical University",
            "Tianjin Normal University",
        ],
        "highlights": [
            "Municipality near Beijing",
            "Important northern port city",
            "Good North China student option",
            "Practical access to Beijing",
        ],
    },
    {
        "slug": "harbin",
        "name": "Harbin",
        "province": "Heilongjiang",
        "region": "north",
        "lat": 45.8038,
        "lng": 126.5350,
        "description": "Harbin is the capital of Heilongjiang Province and a major city in Northeast China, known for cold winters, ice and snow culture, and strong engineering education.",
        "image_url": None,
        "tags": ["northeast china", "winter", "engineering", "ice city"],
        "student_summary": "Good for students who want strong engineering universities and are prepared for serious winter weather.",
        "cost_level": "medium",
        "popular_universities": [
            "Harbin Institute of Technology",
            "Harbin Engineering University",
            "Harbin Medical University",
            "Heilongjiang University",
        ],
        "highlights": [
            "Capital of Heilongjiang Province",
            "Strong engineering environment",
            "Known for ice and snow culture",
            "Students must prepare seriously for winter",
        ],
    },
    {
        "slug": "kunming",
        "name": "Kunming",
        "province": "Yunnan",
        "region": "west",
        "lat": 25.0389,
        "lng": 102.7183,
        "description": "Kunming is the capital of Yunnan Province and is known for mild weather, cultural diversity, natural scenery, and a calmer lifestyle in southwest China.",
        "image_url": None,
        "tags": ["yunnan", "southwest china", "mild climate", "culture"],
        "student_summary": "Good for students who prefer mild weather, cultural diversity, natural scenery, and a slower adaptation pace than first-tier cities.",
        "cost_level": "medium",
        "popular_universities": [
            "Yunnan University",
            "Kunming University of Science and Technology",
            "Yunnan Normal University",
            "Kunming Medical University",
        ],
        "highlights": [
            "Capital of Yunnan Province",
            "Mild climate",
            "Southwest China gateway",
            "Good for calmer student life",
        ],
    },
]


REAL_CHINA_EVENTS_2026 = [
    {
        "title": "New Year's Day Holiday",
        "description": "China public holiday period for New Year's Day 2026. Official holiday period: January 1 to January 3. January 4 is adjusted as a working day.",
        "location": "China nationwide",
        "event_date": date(2026, 1, 1),
        "start_time": "All day",
        "tag": "festival",
    },
    {
        "title": "Spring Festival Holiday",
        "description": "China public holiday period for Spring Festival / Chinese New Year 2026. Official holiday period: February 15 to February 23. February 14 and February 28 are adjusted working days.",
        "location": "China nationwide",
        "event_date": date(2026, 2, 15),
        "start_time": "All day",
        "tag": "festival",
    },
    {
        "title": "Lantern Festival",
        "description": "Traditional Chinese festival marking the end of the Chinese New Year celebration period. Common customs include lantern displays, lantern riddles, and eating tangyuan. This is a traditional festival, not a nationwide public holiday.",
        "location": "China nationwide",
        "event_date": date(2026, 3, 3),
        "start_time": "Evening",
        "tag": "festival",
    },
    {
        "title": "Qingming Festival Holiday",
        "description": "China public holiday period for Qingming Festival / Tomb-Sweeping Day 2026. Official holiday period: April 4 to April 6.",
        "location": "China nationwide",
        "event_date": date(2026, 4, 4),
        "start_time": "All day",
        "tag": "festival",
    },
    {
        "title": "Labor Day Holiday",
        "description": "China public holiday period for Labor Day 2026. Official holiday period: May 1 to May 5. May 9 is adjusted as a working day.",
        "location": "China nationwide",
        "event_date": date(2026, 5, 1),
        "start_time": "All day",
        "tag": "festival",
    },
    {
        "title": "Dragon Boat Festival Holiday",
        "description": "China public holiday period for Dragon Boat Festival 2026. Official holiday period: June 19 to June 21. Common customs include eating zongzi and dragon boat racing.",
        "location": "China nationwide",
        "event_date": date(2026, 6, 19),
        "start_time": "All day",
        "tag": "festival",
    },
    {
        "title": "Qixi Festival",
        "description": "Traditional Chinese festival also known as the Double Seventh Festival or Chinese Valentine's Day. This is a traditional festival, not a nationwide public holiday.",
        "location": "China nationwide",
        "event_date": date(2026, 8, 19),
        "start_time": "All day",
        "tag": "festival",
    },
    {
        "title": "Mid-Autumn Festival Holiday",
        "description": "China public holiday period for Mid-Autumn Festival 2026. Official holiday period: September 25 to September 27. Common customs include mooncakes, family gatherings, and moon appreciation.",
        "location": "China nationwide",
        "event_date": date(2026, 9, 25),
        "start_time": "All day",
        "tag": "festival",
    },
    {
        "title": "National Day Golden Week",
        "description": "China public holiday period for National Day 2026. Official holiday period: October 1 to October 7. September 20 and October 10 are adjusted working days.",
        "location": "China nationwide",
        "event_date": date(2026, 10, 1),
        "start_time": "All day",
        "tag": "festival",
    },
    {
        "title": "Double Ninth Festival",
        "description": "Traditional Chinese festival also known as Chongyang Festival. It is associated with respecting elders, climbing mountains, and autumn customs. This is a traditional festival, not a nationwide public holiday in mainland China.",
        "location": "China nationwide",
        "event_date": date(2026, 10, 18),
        "start_time": "All day",
        "tag": "festival",
    },
]


UNIVERSITY_TOPICS = [
    (
        "What I ask the international office before solving documents",
        "guide",
        [
            "I used to think every document problem had one clear answer. In reality, the international office is usually the safest first stop.",
            "Before going to a government office, I ask which papers the university must issue first. This avoids wasting half a day on missing documents.",
            "I also keep passport copies, admission notice, visa page, accommodation proof, and ID photos in one folder.",
            "The small habit that helped me most was writing down the Chinese name of every office and building.",
        ],
    ),
    (
        "How I organize admission papers after arriving at university",
        "tip",
        [
            "The first week can become messy fast because everyone asks for documents at different times.",
            "I keep one physical folder and one phone folder. The physical folder has passport copies, photos, admission notice, visa page, and registration papers.",
            "The phone folder has scanned copies and screenshots. I name files clearly instead of leaving them as random camera photos.",
            "This sounds boring, but it saves you when an office asks for something suddenly.",
        ],
    ),
    (
        "How to email your supervisor without sounding careless",
        "guide",
        [
            "A bad email can make you look lazy even when you are just nervous.",
            "I keep supervisor emails short: who I am, what I need, what I already tried, and what time I am available.",
            "Do not send messages like 'teacher help me' with no context. That creates more work for the teacher.",
            "Attach files properly and use a clear subject line. Respect matters more than perfect English.",
        ],
    ),
    (
        "What I wish I knew before course selection",
        "experience",
        [
            "Course selection looked simple until I saw overlapping times, unfamiliar course names, and system rules I did not understand.",
            "Before choosing, I ask senior students which courses are required, which are electives, and which teacher explains clearly.",
            "I also check whether a course affects graduation requirements. A random choice can become a real problem later.",
            "Do not choose only based on the easiest name. Ask what the course actually requires.",
        ],
    ),
    (
        "How to survive class WeChat groups",
        "tip",
        [
            "Class WeChat groups are not just chat rooms. Sometimes they are where important notices appear first.",
            "I pin important groups, turn on notifications for official groups, and avoid sending unrelated messages.",
            "If I do not understand a notice, I screenshot it and ask one clear question.",
            "Do not ignore group messages for a week and then complain that nobody told you.",
        ],
    ),
    (
        "Questions to ask before accepting a dormitory room",
        "guide",
        [
            "Dormitory is not only about price. Location, kitchen rules, bathroom type, heating, laundry, and curfew can change daily life.",
            "Before accepting, I ask whether bedding is included, whether electricity is prepaid, and where repairs are reported.",
            "I also ask if international students are placed together or mixed with other students.",
            "A cheap room is not always a good room if transport and rules make life difficult.",
        ],
    ),
    (
        "How I prepare for a thesis meeting",
        "experience",
        [
            "The worst meeting is the one where you arrive with only excuses.",
            "Before meeting my advisor, I prepare three things: what I finished, what blocked me, and what decision I need.",
            "I bring screenshots or code results instead of talking vaguely.",
            "Teachers are more helpful when they can see the real problem.",
        ],
    ),
    (
        "What to do when you do not understand a university notice",
        "tip",
        [
            "University notices can be hard because they may use formal Chinese or administrative language.",
            "I first translate the notice, then check dates, office names, required documents, and whether it applies to international students.",
            "If I ask for help, I do not ask 'what does this mean?' I ask about the exact part I do not understand.",
            "This makes people more willing to help.",
        ],
    ),
    (
        "How to avoid missing university deadlines",
        "guide",
        [
            "The biggest student mistake is thinking one reminder is enough.",
            "I keep deadlines in a calendar, take screenshots of official notices, and write the office name beside each task.",
            "For important deadlines, I set reminders one week before and one day before.",
            "Missing a small date can create a big document problem later.",
        ],
    ),
    (
        "How to ask senior students for useful advice",
        "tip",
        [
            "Senior students can help a lot, but only if you ask properly.",
            "Do not ask huge questions like 'tell me everything about university.' Ask specific things: dorm cost, best print shop, registration steps, or teacher communication.",
            "Also remember that one senior student's experience is not official policy.",
            "Use their advice as a map, then confirm important things with the university.",
        ],
    ),
    (
        "What international students should check before paying fees",
        "guide",
        [
            "Before paying accommodation or other fees, I check the official payment method, deadline, amount, and receipt process.",
            "Do not trust random screenshots or unofficial messages for payment.",
            "If the university gives a bank account or QR code, confirm it through an official office or official system.",
            "Keep the receipt. You may need it later.",
        ],
    ),
    (
        "How I use office hours without wasting time",
        "experience",
        [
            "Office hours are useful if you prepare. They are useless if you arrive with no question.",
            "I write my question first, then add what I already tried. If it is a coding problem, I bring the error message.",
            "For thesis work, I bring a small progress list and one decision I need from the teacher.",
            "This makes the meeting shorter and more useful.",
        ],
    ),
    (
        "How to handle group projects with language barriers",
        "experience",
        [
            "Group projects can be awkward when students use different languages or working styles.",
            "What helped me was asking the group to write tasks clearly in WeChat and set small deadlines.",
            "I also repeat my task back to make sure I understood it.",
            "Do not disappear because you feel shy. Silence makes classmates trust you less.",
        ],
    ),
    (
        "How to prepare for final exams in a new university system",
        "guide",
        [
            "Exam style can be different from what you know at home.",
            "I ask about exam format early: closed book, open book, project, presentation, or written test.",
            "I also ask whether attendance, homework, and class participation affect the final grade.",
            "Do not wait until the last week to understand the grading system.",
        ],
    ),
    (
        "Why campus location matters more than university photos",
        "tip",
        [
            "A university can look beautiful online, but your daily life depends on campus location.",
            "Before choosing, check transport, nearby food, dorm distance, hospital access, and how far the campus is from the city center.",
            "Some universities have several campuses, and international students may not be on the main one.",
            "Ask the exact campus name, not only the university name.",
        ],
    ),
    (
        "How to build a simple weekly study routine",
        "guide",
        [
            "A new country can destroy your routine if you let every small problem take over your week.",
            "I keep fixed blocks for classes, document tasks, groceries, exercise, and project work.",
            "For thesis or coding work, I set small targets instead of waiting for motivation.",
            "A boring routine is better than panic every Sunday night.",
        ],
    ),
    (
        "How to talk to teachers when your Chinese is weak",
        "tip",
        [
            "Weak Chinese does not mean you should avoid communication.",
            "I prepare simple sentences, use screenshots, and write key names or numbers clearly.",
            "If I use translation, I keep the message short because long translated paragraphs can become confusing.",
            "Respect and clarity matter more than perfect grammar.",
        ],
    ),
    (
        "Why you should not depend only on your country group",
        "experience",
        [
            "Country groups are helpful in the first days, but they can also limit you.",
            "I learned more when I joined mixed student groups, campus activities, and class discussions.",
            "You still need friends from your country, but do not make that your whole university life.",
            "The fastest way to adapt is to ask questions outside your comfort zone.",
        ],
    ),
    (
        "How to prepare documents before leaving campus for vacation",
        "guide",
        [
            "Before traveling or leaving campus for a long break, I check my passport, residence permit, student ID, and emergency contacts.",
            "I also ask whether the dorm needs registration, whether campus gates change rules, and whether I need to report travel.",
            "Do not leave important paperwork until the night before travel.",
            "Travel is easier when your documents are already organized.",
        ],
    ),
    (
        "What makes a good university post on Huaxia",
        "tip",
        [
            "A useful university post is not just complaining. It explains the problem, the office involved, what you tried, and what helped.",
            "Do not share private teacher information or personal student details.",
            "Write enough context so another student can learn from it.",
            "Good posts make the platform useful. Lazy posts make it look dead.",
        ],
    ),
]


DAILY_LIFE_POSTS = [
    {
        "title": "Residence permit steps new students should not ignore",
        "content_type": "guide",
        "content": """When students arrive in China with a study visa, one of the first serious tasks is checking the residence permit process. Do not treat this like a small campus form. If you miss the timing or documents, it can become a real problem.

The first thing I would do is ask the international student office which documents the university must issue before you go anywhere else. Usually students need to keep their passport, visa page, admission notice, accommodation registration, ID photos, and university documents ready.

Do not copy another student blindly. Their city, visa type, or university process may be different.

My practical advice is simple: create one folder for immigration-related documents and keep scanned copies on your phone. Ask the university first, then follow the local process. Do not wait until the final days.""",
    },
    {
        "title": "Temporary residence registration explained in normal student language",
        "content_type": "guide",
        "content": """Temporary residence registration sounds scary, but the idea is simple: the local system needs to know where you are living.

If you live in a university dormitory, the school may help with this process. If you rent outside, the landlord or local police station process may be involved. The mistake students make is assuming the dormitory and outside apartment process are the same.

Ask these questions immediately after arrival:
1. Does the university handle dorm registration?
2. Do I need a printed form?
3. What happens if I change dorm or apartment?
4. Do I need this paper for residence permit?

Do not ignore this because it sounds administrative. This document can connect to other official steps later. Keep a copy and take a clear photo of it.""",
    },
    {
        "title": "How I set up a Chinese SIM card after arrival",
        "content_type": "experience",
        "content": """Getting a Chinese phone number should be one of your first tasks. Without it, many apps, payment systems, delivery services, and campus systems become harder.

Bring your passport when buying a SIM card. Do not expect to buy it like a snack from a shop. Real-name registration is required, so the staff need your passport information.

Before choosing a plan, ask about:
1. Monthly price.
2. Data limit.
3. Whether calls are included.
4. Whether the plan can be cancelled.
5. Whether the shop is official.

My advice: choose a simple plan first. Do not buy an expensive package before you understand your real data usage. Also save the customer service number because you may need it later if your SIM stops working or your package changes.""",
    },
    {
        "title": "What to know before opening a bank account in China",
        "content_type": "guide",
        "content": """Opening a bank account can be smooth or annoying depending on documents. Do not go to the bank with only your passport and hope everything works.

Before going, ask your university which bank branch students usually use. Some branches are more familiar with international students than others. That matters.

Prepare these if available:
1. Passport.
2. Valid visa or residence permit.
3. Student certificate or admission document.
4. Chinese phone number.
5. Dorm or residence address.
6. University contact information.

Do not get angry if the bank asks for extra confirmation. Sometimes staff are following rules, not trying to make life difficult.

My advice: go with another student who already opened an account, or ask the international office which branch is easiest for your university.""",
    },
    {
        "title": "How to use mobile payment without panicking",
        "content_type": "tip",
        "content": """Mobile payment is normal in China, but new students can feel stuck when WeChat Pay or Alipay asks for verification.

First, make sure your phone number is working. Then connect your bank card if you have one. Some students can use international cards in certain situations, but for daily campus life, a local setup is usually easier.

Do not wait until you are standing in a shop to test payment. Test it with a small purchase first.

Useful habits:
1. Keep some cash for emergencies.
2. Screenshot payment errors before asking for help.
3. Check whether your name matches your bank/passport information.
4. Keep your phone charged.
5. Do not send money to random people who offer “payment help.”

Mobile payment becomes easy after setup, but the first week needs patience.""",
    },
    {
        "title": "What I learned from my first hospital visit in China",
        "content_type": "experience",
        "content": """My first hospital visit in China taught me one thing: preparation matters more than confidence.

Before going, save the hospital name in Chinese. Bring your passport, student card if you have one, phone, payment method, and any medical records or medicine names. If your Chinese is weak, write symptoms in simple sentences and translate them before arriving.

The hardest part is often registration, not seeing the doctor. Some hospitals use machines, apps, or counters. Ask your university if there is a recommended hospital for international students.

Do not wait until you are very sick to learn where the nearest hospital is. Find it during your first month.

Also ask about insurance rules early. Knowing whether you can claim costs later changes what documents you need to keep.""",
    },
    {
        "title": "How to prepare a small emergency document folder",
        "content_type": "guide",
        "content": """Every international student should have an emergency document folder. This is boring advice until the day it saves you.

My folder includes:
1. Passport copy.
2. Visa or residence permit copy.
3. Admission notice.
4. Student ID photo.
5. University address in Chinese and English.
6. Emergency contact numbers.
7. Insurance information.
8. Temporary residence registration copy if available.
9. Important payment receipts.
10. A few passport-style photos.

Keep one physical folder and one digital folder. For the digital folder, use clear names like passport_photo_page, visa_page, dorm_address, and university_contact. Do not leave everything as random camera images.

This helps with hospitals, banks, offices, travel, and emergencies. It takes one hour to prepare and can save days of stress.""",
    },
    {
        "title": "How to receive parcels on campus without losing them",
        "content_type": "tip",
        "content": """Parcel delivery in China is convenient, but campus delivery can confuse new students.

The first mistake is writing an incomplete address. Do not only write the university name. Add campus, dorm building, room number if allowed, phone number, and your name in the format your campus uses.

Ask senior students where parcels usually arrive. Some campuses use parcel stations, smart lockers, delivery shelves, or shop counters near the gate.

Useful tips:
1. Save your address in Chinese.
2. Use the same phone number every time.
3. Check pickup codes carefully.
4. Pick parcels quickly during busy periods.
5. Do not order important items right before holidays.

If a parcel is missing, screenshot the tracking page and ask the delivery station politely. Angry messages do not help if your address was unclear.""",
    },
    {
        "title": "Dorm laundry mistakes new students make",
        "content_type": "experience",
        "content": """Dorm laundry looks simple until you ruin clothes or annoy everyone on your floor.

First, ask how the washing machines work. Some use apps, QR codes, student cards, or coins. Do not assume every dorm uses the same system.

Common mistakes:
1. Leaving clothes in the machine for hours.
2. Using too much detergent.
3. Washing dark and white clothes together.
4. Ignoring drying rules.
5. Using machines during busy times and blocking others.

If your dorm has shared laundry, set a timer on your phone. Remove clothes when the cycle ends. This is basic respect.

Also ask whether drying racks are allowed in your room or balcony. Some dorms have rules. It is better to know early than to get a warning later.""",
    },
    {
        "title": "How to budget the first month after arriving in China",
        "content_type": "guide",
        "content": """The first month is usually more expensive than normal months. Do not use it to judge your long-term cost without thinking.

You may need to pay for bedding, SIM card, transport card, health check, document photos, temporary items, kitchen tools, laundry supplies, and maybe medical or residence permit costs.

Separate your budget into:
1. Food.
2. Transport.
3. Phone and internet.
4. Dorm or rent.
5. Documents.
6. Emergency money.
7. Setup items.

Do not spend too much in the first week because everything feels new. Buy what you need first, then slowly buy comfort items.

My advice: track spending for 30 days. After that, you will know your real student budget instead of guessing.""",
    },
    {
        "title": "What apps helped me during my first semester",
        "content_type": "tip",
        "content": """Apps can make life easier, but do not download random apps without knowing why.

The basic app groups I needed were:
1. Payment.
2. Maps.
3. Translation.
4. Delivery.
5. Transport.
6. University communication.
7. Online shopping.
8. Calendar or task reminders.

WeChat is important because many university notices and class groups use it. A map app is important because addresses in China are easier when searched in Chinese. Translation apps help, but screenshots and simple messages are often better than long translated paragraphs.

Do not depend only on apps. Ask people too, especially for campus-specific things like dorm repairs, parcel pickup, and office locations.

My advice: keep your home screen simple. Too many apps create confusion when you are already stressed.""",
    },
    {
        "title": "How to buy train tickets during busy holidays",
        "content_type": "guide",
        "content": """Train tickets during major Chinese holidays can disappear quickly. This is not the time to be casual.

Before Spring Festival, National Day, Labor Day, or other long breaks, plan early. Check your university schedule, exam dates, dorm rules, and ticket availability before promising friends you will travel.

Useful habits:
1. Know your passport information exactly.
2. Use the same name format as your ID.
3. Book early during holiday periods.
4. Arrive at the station early if it is your first trip.
5. Keep your passport with you because it is your travel ID.

Do not plan tight transfers when you are new. Big stations can be confusing.

If tickets are sold out, do not panic-buy from unsafe sources. Ask experienced students or use official channels.""",
    },
    {
        "title": "What to do if you lose your passport",
        "content_type": "guide",
        "content": """Losing your passport is serious, but panic will not fix it.

First, search carefully and retrace your steps. If it is really lost, contact your university international office and your embassy or consulate for guidance. You may also need to report the loss locally.

Prepare information:
1. Passport copy or photo.
2. Visa/residence permit copy if available.
3. Student information.
4. Police report details if required.
5. Embassy contact information.
6. Recent ID photos if needed.

This is why keeping digital passport copies matters.

Do not travel without solving the situation properly. Do not rely on random advice from social media. Your university and embassy/consulate are the serious sources here.

My advice: save embassy contact details before you need them.""",
    },
    {
        "title": "How to keep official screenshots organized",
        "content_type": "tip",
        "content": """Screenshots are useful only if you can find them later.

During the semester, you may receive notices about registration, exams, fees, dorm rules, holidays, health checks, and events. If you screenshot everything randomly, your phone becomes a mess.

Create albums like:
1. University notices.
2. Documents.
3. Payments.
4. Addresses.
5. Travel.
6. Health.
7. Thesis or classes.

When a notice has a deadline, add it to your calendar immediately. A screenshot alone is not a reminder.

Also rename important files if your phone allows it. Searching for “residence permit” is better than scrolling through 800 images.

This small habit makes you look organized when offices ask for proof.""",
    },
    {
        "title": "What to pack before coming to China",
        "content_type": "guide",
        "content": """Do not pack like you are going on vacation. Pack like you are moving into a student life system.

Important things:
1. Passport and admission documents.
2. Copies of documents.
3. Some passport photos.
4. Basic medicine you are allowed to bring.
5. Clothes for the city climate.
6. Adapter if needed.
7. A small amount of emergency cash.
8. Items from home that are hard to find.
9. Laptop and chargers.
10. A folder for papers.

Do not overpack things you can buy cheaply after arrival, like basic daily supplies. Save space for things that are personal, medical, or document-related.

Check your city climate before packing. Harbin and Guangzhou are not the same life. A lazy packing list can become expensive later.""",
    },
]


CULTURE_POSTS = [
    {
        "title": "What Spring Festival means for international students in China",
        "content_type": "guide",
        "content": """Spring Festival is not just a holiday name. For international students, it changes transport, campus life, shops, restaurants, and daily rhythm.

In 2026, the official Spring Festival holiday period is February 15 to February 23, with adjusted working days before and after the break. That means students should not wait until the last week to plan travel or documents.

What students should know:
1. Train and flight tickets can sell out early.
2. Some campus offices may close.
3. Restaurants and shops may change opening hours.
4. Cities can feel quieter because many people travel home.
5. If you stay on campus, ask about dorm and canteen arrangements.

Spring Festival can be a beautiful cultural experience, but only if you prepare. Do not plan important paperwork during the holiday period unless the university confirms offices are open.""",
    },
    {
        "title": "Why trains sell out around major Chinese holidays",
        "content_type": "experience",
        "content": """The first time I saw train tickets disappear around a holiday, I understood how serious travel planning is in China.

Major holidays are not just free days. Millions of people travel for family visits, tourism, and returning home. For students, this means waiting too long can destroy your travel plan.

Be careful around Spring Festival, Labor Day, National Day, and other holiday periods. In 2026, Labor Day runs May 1 to May 5 and National Day runs October 1 to October 7, so those periods can be extremely busy.

Student advice:
1. Book early.
2. Avoid tight schedules.
3. Check adjusted working days.
4. Keep your passport ready for travel.
5. Do not assume cheap tickets will stay available.

A holiday trip is fun only if you plan before everyone else panics.""",
    },
    {
        "title": "How to understand Qingming Festival respectfully",
        "content_type": "guide",
        "content": """Qingming Festival is connected with remembering ancestors and tomb-sweeping. International students should understand it respectfully, not treat it like just another day off.

In 2026, the official Qingming holiday period is April 4 to April 6. Some students may travel, but for many Chinese families this period has a serious family meaning.

If classmates mention family activities, do not joke about it. Ask politely if you are curious. A respectful question is better than pretending you understand.

What students should know:
1. It is connected with remembrance.
2. Travel may be busy.
3. Some people visit ancestral graves.
4. Weather and outdoor activities are often part of the season.
5. It is not mainly a party holiday.

Cultural adaptation means learning when to be quiet and respectful, not only when to join celebrations.""",
    },
    {
        "title": "What Dragon Boat Festival is like for students",
        "content_type": "experience",
        "content": """Dragon Boat Festival is one of the Chinese holidays international students usually hear about because of zongzi and dragon boat racing.

In 2026, the official Dragon Boat Festival holiday period is June 19 to June 21. Depending on your city and university, there may be campus activities, food sharing, or local events.

What I would pay attention to:
1. Try zongzi, but ask what filling it has.
2. Check if your city has dragon boat activities.
3. Confirm whether classes or offices are affected.
4. Do not assume every festival event is near your campus.
5. Ask classmates about local customs.

For students, this festival is a good chance to learn through food and community activities. Just do not reduce it to “sticky rice day.” It has history and cultural meaning behind it.""",
    },
    {
        "title": "How Mid-Autumn Festival appears on campus",
        "content_type": "guide",
        "content": """Mid-Autumn Festival is one of the easiest Chinese festivals for international students to notice on campus because of mooncakes.

In 2026, the official Mid-Autumn Festival holiday period is September 25 to September 27. Universities may organize small activities, give mooncakes, or share festival explanations.

What students should understand:
1. Mooncakes are symbolic, not just snacks.
2. The festival is connected with family reunion and moon appreciation.
3. Some students may go home or spend time with close friends.
4. Campus activities can be a good way to join without feeling lost.
5. Different regions may have different food customs.

If someone gives you mooncakes, accept politely. If you do not like the taste, do not make rude comments. Food is often emotional during festivals.

This is a good festival for learning how culture, family, and food connect in China.""",
    },
    {
        "title": "What National Day Golden Week means for travel planning",
        "content_type": "guide",
        "content": """National Day Golden Week is one of the busiest travel periods in China. Students should treat it seriously.

In 2026, the official National Day holiday period is October 1 to October 7, with adjusted working days on September 20 and October 10. This matters because some students forget that adjusted working days can affect classes and campus schedules.

If you plan to travel:
1. Book tickets early.
2. Avoid the most crowded tourist spots if you hate crowds.
3. Check hotel prices before buying transport tickets.
4. Keep your passport with you.
5. Tell your dorm or classmates if required by university rules.

If you stay on campus, ask whether canteens, gates, and offices change hours.

Golden Week can be great, but bad planning will make it expensive, crowded, and stressful.""",
    },
    {
        "title": "Why Chinese dinner invitations can feel confusing at first",
        "content_type": "experience",
        "content": """The first time I joined a Chinese dinner with classmates, I was not sure when to sit, when to eat, or how much to talk.

Dinner can be social communication, not only food. People may share dishes, offer food, toast with drinks, or insist that you eat more. This can feel intense if you are not used to it.

Useful advice:
1. Watch what others do before acting.
2. Try a little food before refusing.
3. If you cannot eat something, explain politely.
4. Do not make dramatic comments about unfamiliar food.
5. Say thank you clearly.

You do not need to become perfect in one dinner. Just be respectful and curious.

Food is one of the easiest ways to connect with classmates, but bad manners can create distance quickly.""",
    },
    {
        "title": "How to behave when visiting a Chinese family",
        "content_type": "guide",
        "content": """If a Chinese classmate or teacher invites you to their family home, treat it with respect.

Bring a small gift if appropriate. It does not need to be expensive. Fruit, snacks from your country, or something simple can be enough. Ask your friend if you are unsure.

During the visit:
1. Arrive on time.
2. Greet elders politely.
3. Do not walk around private spaces without being invited.
4. Try food respectfully.
5. Offer thanks before leaving.
6. Send a thank-you message afterward.

Do not treat the home like a tourist attraction. You are being welcomed into someone’s private space.

If you have dietary restrictions, explain them early and politely. Waiting until food is served can make the situation awkward.""",
    },
    {
        "title": "Why WeChat groups matter in Chinese social life",
        "content_type": "tip",
        "content": """In China, WeChat groups are not only for chatting. They can be where classes, dorms, activities, offices, and student communities share important information.

For international students, ignoring WeChat groups is dangerous. You may miss deadlines, schedule changes, payment reminders, or event information.

Useful habits:
1. Pin important groups.
2. Mute noisy groups but check them daily.
3. Save official notices.
4. Ask clear questions.
5. Do not spam unrelated messages.
6. Learn the Chinese names of important offices.

If you do not understand a message, screenshot it and ask someone about the exact sentence. Do not just say “I do not understand everything.”

WeChat groups can feel messy, but they are part of real student life in China.""",
    },
    {
        "title": "How to ask cultural questions without sounding rude",
        "content_type": "guide",
        "content": """International students should ask cultural questions. The problem is how they ask.

Bad style:
“Why do Chinese people do this weird thing?”

Better style:
“I noticed this custom and I do not understand it yet. Can you explain what it means?”

The second version shows respect. The first version sounds like judgment.

Useful rules:
1. Do not call something strange just because it is new to you.
2. Ask one specific question.
3. Listen before comparing with your country.
4. Avoid stereotypes like “all Chinese people.”
5. Thank the person for explaining.

Culture shock is normal. Being disrespectful is not.

If you ask well, classmates usually enjoy explaining. If you ask badly, they may stop sharing with you.""",
    },
    {
        "title": "What to know before giving small gifts in China",
        "content_type": "tip",
        "content": """Gift-giving can be friendly, but it can also become awkward if you do not understand the situation.

For classmates, simple snacks from your country can be nice. For teachers or offices, be careful and keep things modest. Do not give expensive gifts because it can create pressure or look inappropriate.

Better gift ideas:
1. Small food from your country.
2. A postcard.
3. A simple cultural souvenir.
4. Fruit for a casual visit.

Avoid making the gift feel like payment for help. A thank-you message is sometimes better than an object.

If someone refuses at first, do not force the situation. In some contexts, polite refusal is normal.

Gift-giving should express respect, not create obligation.""",
    },
    {
        "title": "How to join campus activities when your Chinese is weak",
        "content_type": "experience",
        "content": """Weak Chinese can make students avoid activities, but avoiding everything makes adaptation slower.

Start with activities where language is not the whole point: sports, food sharing, calligraphy, music, volunteer events, city walks, or cultural workshops.

Before joining:
1. Ask where and when.
2. Save the location in Chinese.
3. Prepare one or two self-introduction sentences.
4. Go with a classmate if you feel nervous.
5. Do not leave immediately if you feel awkward.

You do not need perfect Chinese to participate. You need basic courage and respect.

The first activity may feel uncomfortable. The second one is easier. After a few times, people start recognizing you, and campus feels less lonely.""",
    },
    {
        "title": "What culture shock looked like after one month",
        "content_type": "experience",
        "content": """Culture shock did not hit me on the first day. The first days were too busy. It came after about one month, when small things started feeling heavy.

Food was different. Apps were different. Offices worked differently. Class communication was different. Even simple tasks took more energy than I expected.

What helped:
1. Building a routine.
2. Asking specific questions.
3. Walking around campus instead of staying in my room.
4. Learning daily Chinese phrases.
5. Talking to students from different countries.
6. Accepting that adaptation takes time.

Do not mistake culture shock for failure. It is part of the process.

But also do not use it as an excuse to disappear. If you isolate yourself completely, everything becomes harder.""",
    },
    {
        "title": "How to share your own culture without stereotyping others",
        "content_type": "guide",
        "content": """Huaxia should not only be international students learning about China. It should also be students sharing their own cultures responsibly.

When you share your culture, avoid saying “everyone in my country does this.” Countries are diverse. Families, regions, religions, languages, and personal habits can be different.

Better way:
“In my family...”
“In my city...”
“Some people in my country...”
“From my experience...”

This makes your post more honest.

Also avoid using another culture only as a comparison to prove yours is better. The point is exchange, not competition.

Good cultural sharing explains meaning, context, and personal experience. Bad cultural sharing becomes stereotypes with pretty words.""",
    },
    {
        "title": "Why adjusted working days confuse international students",
        "content_type": "guide",
        "content": """One thing that surprises many international students in China is adjusted working days.

Sometimes a long holiday includes weekend make-up workdays before or after the break. For example, some 2026 public holidays include adjusted working days around Spring Festival, Labor Day, and National Day.

This matters because your university schedule may change. A Sunday can become a working or class day, and a weekday can become part of a holiday.

Student advice:
1. Check official university calendars.
2. Do not rely only on normal weekday/weekend logic.
3. Ask whether classes move because of holiday adjustment.
4. Watch WeChat notices carefully.
5. Add adjusted days to your calendar.

If you ignore adjusted working days, you may miss class or office hours without realizing why.""",
    },
    {
        "title": "What Double Ninth Festival means and why students should know it",
        "content_type": "guide",
        "content": """Double Ninth Festival, also called Chongyang Festival, is a traditional Chinese festival connected with respect for elders, autumn activities, and climbing mountains in some customs.

It is not one of the nationwide public holidays in mainland China, so students may not get time off. But it can still appear in cultural lessons, campus activities, community events, or conversations about family values.

Why it matters:
1. It helps students understand respect for elders in Chinese culture.
2. It shows that not every important festival is a public holiday.
3. It can connect to volunteer activities with older people.
4. It gives cultural context beyond the most famous holidays.

If your university has a related activity, join it with respect. It is a good chance to understand values, not just festival names.""",
    },
]


COMMENT_BANK = [
    "This is exactly the kind of detail new students usually do not hear before arriving.",
    "I agree with this. The small practical steps matter more than big general advice.",
    "One more thing I would add is to keep screenshots of addresses and office names.",
    "This helped me understand the problem better. I wish I had read this earlier.",
    "Good point. Students should confirm official rules with the university before acting.",
    "The budget part is real. Small costs become serious in the first month.",
    "This is useful because it explains what actually happens, not only what should happen.",
    "I had a similar experience, especially with documents and WeChat notices.",
    "This advice is simple, but ignoring it creates problems fast.",
    "New students should save this before arrival.",
]


def normalize_tag(value: str) -> str:
    return value.lower().replace(" ", "-").replace("'", "").replace("/", "-").strip("-")


def make_summary(content: str) -> str:
    first_paragraph = content.strip().split("\n\n")[0]
    if len(first_paragraph) <= 220:
        return first_paragraph
    return first_paragraph[:217].rstrip() + "..."


def local_category(page_name: str, content_type: str) -> str:
    if page_name == "cities":
        return "city-life"
    if page_name == "universities":
        return "university-life"
    if page_name == "daily_life":
        return "daily-life"
    if page_name == "culture":
        return "culture-and-adaptation"
    return content_type


def local_ai_analysis(page_name: str, title: str) -> str:
    return (
        "Seeded local analysis for demo data. "
        f"This post belongs to {page_name} and discusses: {title}. "
        "It was generated for Huaxia testing, semantic search, and community page population."
    )


def make_topic_post(
    title: str,
    page_name: str,
    content_type: str,
    paragraphs: list[str],
) -> dict[str, Any]:
    return {
        "title": title,
        "page_name": page_name,
        "content_type": content_type,
        "city_id": None,
        "city_slug": None,
        "content": "\n\n".join(paragraphs),
    }


def make_city_posts(cities: list[City]) -> list[dict[str, Any]]:
    posts: list[dict[str, Any]] = []

    for city in cities:
        universities = (
            ", ".join(city.popular_universities[:2])
            if city.popular_universities
            else "local universities"
        )
        highlights = (
            ", ".join(city.highlights[:3])
            if city.highlights
            else "student life, transport, and campus routines"
        )

        posts.append(
            {
                "title": f"What I would check before choosing {city.name} as a student city",
                "page_name": "cities",
                "content_type": "experience",
                "city_id": city.id,
                "city_slug": city.slug,
                "content": f"""When students compare cities, they often look at famous photos first. That is a weak way to choose a study city.

For {city.name}, I would start with more practical questions: where the campus is, how transport works, how much daily life costs, and whether the city fits your major.

{city.name} is in {city.province}. The student summary I would give is this: {city.student_summary or "it can be useful for students, but campus location and budget still matter."}

Before choosing it, I would check:
1. Which campus international students actually use.
2. Whether dormitory is guaranteed.
3. How far the campus is from the metro, supermarket, hospital, and train station.
4. Whether the city supports your major or internship plan.
5. Whether the cost level matches your real budget.

Universities students often ask about include {universities}.

The main things that stand out are {highlights}.

My honest advice: choose {city.name} because it fits your student life, not because it looks good in a travel video.""",
            }
        )

        posts.append(
            {
                "title": f"First week notes after arriving in {city.name}",
                "page_name": "cities",
                "content_type": "guide",
                "city_id": city.id,
                "city_slug": city.slug,
                "content": f"""The first week in {city.name} should not be used for random exploring only. You need to make your life stable first.

The basic order that helps most students is simple: campus registration, phone number, payment apps, dorm setup, local transport, and document questions.

My first-week checklist would be:
1. Save your campus address in Chinese and English.
2. Find the nearest metro or bus route.
3. Ask the international office which documents you must handle first.
4. Find the closest supermarket, canteen, hospital, and print shop.
5. Join the official student WeChat groups.
6. Keep passport, admission notice, visa page, photos, and accommodation proof together.
7. Ask senior students which problems are common in this city.

In {city.name}, do not assume every place is close just because it is in the same city. Campus district matters.

A small thing that helps: save screenshots of Chinese names for your university, dorm, and international office. Translation apps are useful, but screenshots are faster when you are tired or lost.""",
            }
        )

        posts.append(
            {
                "title": f"Housing and transport questions students should ask in {city.name}",
                "page_name": "cities",
                "content_type": "tip",
                "city_id": city.id,
                "city_slug": city.slug,
                "content": f"""Housing can make student life easy or miserable. Before you judge {city.name}, check where you will actually live.

The first question is not “Is the city good?” The first question is “Where is my campus and how far is daily life from there?”

Ask these before arrival:
1. Is dormitory guaranteed for international students?
2. Is the campus in the main city area or outside it?
3. How long does it take to reach the nearest metro or bus stop?
4. Are supermarkets, canteens, and hospitals nearby?
5. If I rent outside, what documents and deposit are needed?
6. Is the area safe and convenient at night?
7. How do students usually commute?

Do not compare {city.name} with another city using only online rent averages. Student life depends on the exact campus area.

My rule: a cheaper room is not always cheaper if it costs you time, transport, stress, and safety every week.""",
            }
        )

        posts.append(
            {
                "title": f"How I would budget student life in {city.name}",
                "page_name": "cities",
                "content_type": "guide",
                "city_id": city.id,
                "city_slug": city.slug,
                "content": f"""Budget advice online is often too general. For {city.name}, I would build the budget from real student needs, not from tourist spending.

The main monthly costs are usually food, dormitory or rent, transport, phone data, basic supplies, and emergency money. The first month is usually more expensive because students buy bedding, daily items, document photos, SIM cards, and transport cards.

For {city.name}, the city cost level in Huaxia is marked as {city.cost_level or "unknown"}. That does not mean every student spends the same amount. A student living in a dorm and eating at the canteen spends differently from a student renting outside and eating in restaurants.

My budget checklist:
1. Ask senior students what they really spend near your campus.
2. Separate first-month setup cost from normal monthly cost.
3. Keep emergency money for health, documents, and transport.
4. Learn where students eat, not where tourists eat.
5. Track spending for 30 days before judging the city.

The honest answer is this: {city.name} can work well if your lifestyle matches your budget. Bad planning makes even a medium-cost city feel expensive.""",
            }
        )

    return posts


def build_post_plans(db: Session) -> list[dict[str, Any]]:
    cities = db.query(City).order_by(City.id.asc()).all()
    city_posts = make_city_posts(cities)

    university_posts = [
        make_topic_post(title, "universities", content_type, paragraphs)
        for title, content_type, paragraphs in UNIVERSITY_TOPICS
    ]

    daily_posts = [
        {
            "title": post["title"],
            "page_name": "daily_life",
            "content_type": post["content_type"],
            "city_id": None,
            "city_slug": None,
            "content": post["content"],
        }
        for post in DAILY_LIFE_POSTS
    ]

    culture_posts = [
        {
            "title": post["title"],
            "page_name": "culture",
            "content_type": post["content_type"],
            "city_id": None,
            "city_slug": None,
            "content": post["content"],
        }
        for post in CULTURE_POSTS
    ]

    return city_posts + university_posts + daily_posts + culture_posts


def upsert_seed_user(db: Session, payload: dict[str, str]) -> User:
    user = db.query(User).filter(User.email == payload["email"]).first()

    if user:
        user.username = payload["username"]
        user.bio = payload["bio"]
        user.gender = payload["gender"]
        user.avatar_style = user.avatar_style or DEFAULT_AVATAR_STYLE
        user.avatar_seed = user.avatar_seed or build_default_avatar_seed(user.id)
        return user

    user = User(
        username=payload["username"],
        email=payload["email"],
        password=hash_password(SEED_PASSWORD),
        bio=payload["bio"],
        gender=payload["gender"],
        avatar_style=DEFAULT_AVATAR_STYLE,
        avatar_seed=None,
    )

    db.add(user)
    db.flush()

    user.avatar_seed = build_default_avatar_seed(user.id)

    return user


def upsert_city(db: Session, payload: dict[str, Any]) -> City:
    city = db.query(City).filter(City.slug == payload["slug"]).first()

    if not city:
        city = City(**payload)
        db.add(city)
        db.flush()
        return city

    for key, value in payload.items():
        if key == "image_url" and value is None:
            continue
        setattr(city, key, value)

    db.flush()
    return city


def upsert_culture_event(
    db: Session,
    payload: dict[str, Any],
    creator_user_id: int,
) -> CultureEvent:
    event = (
        db.query(CultureEvent)
        .filter(
            CultureEvent.title == payload["title"],
            CultureEvent.event_date == payload["event_date"],
        )
        .first()
    )

    if not event:
        event = CultureEvent(
            title=payload["title"],
            description=payload["description"],
            location=payload["location"],
            event_date=payload["event_date"],
            start_time=payload["start_time"],
            tag=payload["tag"],
            created_by_user_id=creator_user_id,
        )
        db.add(event)
        db.flush()
        return event

    event.description = payload["description"]
    event.location = payload["location"]
    event.start_time = payload["start_time"]
    event.tag = payload["tag"]
    event.created_by_user_id = creator_user_id

    db.flush()
    return event


def create_or_get_post(db: Session, plan: dict[str, Any], author: User) -> tuple[Post, bool]:
    existing_post = db.query(Post).filter(Post.title == plan["title"]).first()

    if existing_post:
        return existing_post, False

    tags = [
        normalize_tag(plan["page_name"]),
        normalize_tag(plan["content_type"]),
    ]

    if plan.get("city_slug"):
        tags.append(normalize_tag(plan["city_slug"]))

    embedding = generate_embedding(f"{plan['title']}\n\n{plan['content']}")

    post = Post(
        title=plan["title"],
        content=plan["content"],
        page_name=plan["page_name"],
        content_type=plan["content_type"],
        category=local_category(plan["page_name"], plan["content_type"]),
        ai_analysis=local_ai_analysis(plan["page_name"], plan["title"]),
        summary=make_summary(plan["content"]),
        tags=json.dumps(tags),
        embedding=json.dumps(embedding),
        search_vector=None,
        image_url=None,
        likes_count=0,
        dislikes_count=0,
        user_id=author.id,
        city_id=plan.get("city_id"),
    )

    db.add(post)
    db.flush()

    return post, True


def add_comment_if_missing(db: Session, post: Post, user: User, content: str) -> bool:
    exists = (
        db.query(Comment)
        .filter(
            Comment.post_id == post.id,
            Comment.user_id == user.id,
            Comment.content == content,
        )
        .first()
    )

    if exists:
        return False

    db.add(Comment(content=content, post_id=post.id, user_id=user.id))
    return True


def add_reaction_if_missing(
    db: Session,
    post: Post,
    user: User,
    reaction_type: str,
) -> bool:
    if post.user_id == user.id:
        return False

    exists = (
        db.query(PostReaction)
        .filter(PostReaction.post_id == post.id, PostReaction.user_id == user.id)
        .first()
    )

    if exists:
        return False

    db.add(PostReaction(post_id=post.id, user_id=user.id, reaction_type=reaction_type))

    if reaction_type == "like":
        post.likes_count += 1
    else:
        post.dislikes_count += 1

    return True


def refresh_search_vectors(db: Session) -> None:
    db.execute(
        text(
            """
            UPDATE posts
            SET search_vector = to_tsvector(
                'english',
                coalesce(title, '') || ' ' || coalesce(content, '')
            )
            """
        )
    )


def reset_seed_posts(db: Session, seed_users: list[User]) -> None:
    seed_user_ids = [user.id for user in seed_users]

    seed_posts = db.query(Post).filter(Post.user_id.in_(seed_user_ids)).all()
    seed_post_ids = [post.id for post in seed_posts]

    if not seed_post_ids:
        print("[RESET] No seed posts found.")
        return

    deleted_reactions = (
        db.query(PostReaction)
        .filter(PostReaction.post_id.in_(seed_post_ids))
        .delete(synchronize_session=False)
    )
    deleted_comments = (
        db.query(Comment)
        .filter(Comment.post_id.in_(seed_post_ids))
        .delete(synchronize_session=False)
    )
    deleted_posts = (
        db.query(Post)
        .filter(Post.id.in_(seed_post_ids))
        .delete(synchronize_session=False)
    )

    print(f"[RESET] deleted reactions: {deleted_reactions}")
    print(f"[RESET] deleted comments: {deleted_comments}")
    print(f"[RESET] deleted posts: {deleted_posts}")

    db.flush()


def seed_full_demo_data() -> None:
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        print("Seeding Huaxia full demo data...")

        users: list[User] = []
        for payload in SEED_USERS:
            user = upsert_seed_user(db, payload)
            users.append(user)
            print(f"[OK] user: {user.username}")

        if RESET_SEED_POSTS:
            reset_seed_posts(db, users)

        for city_payload in CITIES:
            city = upsert_city(db, city_payload)
            print(f"[OK] city: {city.slug}")

        calendar_user = users[0]

        if RESET_CULTURE_EVENTS:
            deleted_events = db.query(CultureEvent).delete()
            print(f"[RESET] deleted culture events: {deleted_events}")

        for event_payload in REAL_CHINA_EVENTS_2026:
            event = upsert_culture_event(db, event_payload, calendar_user.id)
            print(f"[OK] culture event: {event.title}")

        post_plans = build_post_plans(db)
        print(f"[INFO] generated post plans: {len(post_plans)}")

        created_count = 0
        skipped_count = 0
        comment_count = 0
        reaction_count = 0

        for index, plan in enumerate(post_plans):
            author = users[index % len(users)]
            post, created = create_or_get_post(db, plan, author)

            if created:
                created_count += 1
                print(f"[OK] post: {post.title}")
            else:
                skipped_count += 1
                print(f"[SKIP] post exists: {post.title}")

            comment_user_1 = users[(index + 1) % len(users)]
            comment_user_2 = users[(index + 3) % len(users)]

            comment_1 = COMMENT_BANK[index % len(COMMENT_BANK)]
            comment_2 = COMMENT_BANK[(index + 4) % len(COMMENT_BANK)]

            if add_comment_if_missing(db, post, comment_user_1, comment_1):
                comment_count += 1

            if index % 2 == 0:
                if add_comment_if_missing(db, post, comment_user_2, comment_2):
                    comment_count += 1

            for offset in range(1, 5):
                reaction_user = users[(index + offset) % len(users)]
                reaction_type = "dislike" if index % 23 == 0 and offset == 4 else "like"

                if add_reaction_if_missing(db, post, reaction_user, reaction_type):
                    reaction_count += 1

        refresh_search_vectors(db)

        db.commit()

        print("\n[DONE] Huaxia demo seed completed.")
        print(f"Created posts: {created_count}")
        print(f"Skipped existing posts: {skipped_count}")
        print(f"Added comments: {comment_count}")
        print(f"Added reactions: {reaction_count}")
        print(f"Seed users password: {SEED_PASSWORD}")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_full_demo_data()