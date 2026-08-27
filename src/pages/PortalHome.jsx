import { useState } from "react";
import PageShell from "../components/layout/PageShell";
import Hero from "../components/home/Hero";
import StatRings from "../components/home/StatRings";
import AttendanceThread from "../components/home/AttendanceThread";
import TodayTimeline from "../components/home/TodayTimeline";
import TeacherNote from "../components/home/TeacherNote";
import Friends from "../components/home/Friends";
import GroupRanking from "../components/home/GroupRanking";
import NextLesson from "../components/home/NextLesson";
import FriendSheet from "../components/home/FriendSheet";
import { useHomeData } from "../hooks/useHomeData";

// The order here is the order a parent asks their questions in: who is this,
// how are they doing, are they there today, what did the teacher say, who are
// they with, where do they stand, what is next.
export default function PortalHome() {
  const home = useHomeData();
  const [openFriend, setOpenFriend] = useState(null);

  return (
    <PageShell>
      <Hero
        student={home.student}
        stars={home.stars}
        rank={home.rank}
        payment={home.payment}
        todayReaction={home.todayReaction}
        loading={home.loading}
      />

      <div className="flex flex-col gap-[13px] px-4 pb-[108px] pt-[18px]">
        <StatRings
          mastery={home.mastery}
          behaviour={home.behaviour}
          loading={home.loading}
        />

        <AttendanceThread
          days={home.attendance.days}
          present={home.attendance.present}
          total={home.attendance.total}
          streak={home.attendance.streak}
        />

        <TodayTimeline events={home.timeline} inCentre={home.inCentre} />

        <TeacherNote note={home.teacherNote} />

        <Friends friends={home.friends} onOpen={setOpenFriend} />

        <GroupRanking groups={home.ranking} />

        <NextLesson lesson={home.nextLesson} />
      </div>

      <FriendSheet friend={openFriend} onClose={() => setOpenFriend(null)} />
    </PageShell>
  );
}
