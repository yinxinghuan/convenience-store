import type { StoryBeat } from '../types';

/**
 * 深夜便利店 — 故事结构
 * ─────────────────────
 * 凌晨12点 → Algram（外卖骑手，Jenny的前男友）
 * 凌晨1点  → Jenny（城市史研究生，JM·F的女儿）
 * 凌晨2点  → JM·F（便利店老板，Jenny的父亲，Algram的匿名恩人）
 * 凌晨3点  → 幽灵（1984年的见证者）
 * 黎明     → 八个结局
 *
 * FLAGS:
 *  g_shared            — Algram说出了自己在这条街的原因
 *  aichen_honest       — Algram提到了Jenny
 *  g_warm              — 你鼓励了Algram
 *  c_connected         — Jenny感到被理解
 *  c_stayed            — Jenny凌晨2点还在（留下来了）
 *  suli_forgave        — Jenny对Algram放下了什么
 *  suli_recorded       — Jenny录下了JM·F的口述
 *  suli_confronted_dad — Jenny直接质问了JM·F关于1998年
 *  fangming_explained  — JM·F解释了1998年的事
 *  fangming_benefactor — 发现JM·F是Algram的匿名资助人
 *  fangming_letter     — Jenny找到了JM·F从未寄出的信
 *  letter_opened       — 打开了1984年的信
 *  archive_key         — 找到了档案的钥匙
 *  petition_signed     — 签署了反拆迁请愿书
 *  ghost_seen          — 幽灵被看见了
 *  ghost_told          — 告诉幽灵"你可以走了"
 *  h_soft              — JM·F展现了脆弱的一面
 *  h_daughter_known    — 幽灵得知Jenny是JM·F的女儿
 *
 * 八个结局:
 *  ending_lights_out  — 熄灯（默认）
 *  ending_archive     — 档案（archive_key + letter_opened + suli_recorded）
 *  ending_debt        — 还清了（fangming_benefactor + aichen_honest）
 *  ending_37          — 37号还在（petition_signed）
 *  ending_reunion     — 重逢（aichen_honest + suli_forgave + letter_opened）
 *  ending_family      — 父女（fangming_letter + suli_confronted_dad + fangming_explained）
 *  ending_ghost       — 幽灵出走（g_shared + c_connected + h_daughter_known + ghost_told）
 *  ending_3am         — 新的凌晨三点（全旗标真实结局）
 */

export const STORY: Record<string, StoryBeat> = {

  // ═══════════════════════════════════════════════════════════
  //  INTRO
  // ═══════════════════════════════════════════════════════════

  intro_1: {
    id: 'intro_1',
    speaker: null,
    textZh: '凌晨十二点。37号便利店，这条街上最后一家还亮着灯的铺子。',
    textEn: 'Midnight. Convenience Store No. 37 — the last lit window on the street.',
    next: 'intro_2',
  },
  intro_2: {
    id: 'intro_2',
    speaker: null,
    textZh: '雨下了整晚。冷柜嗡嗡作响。街上没什么人。这片老街区已经收到了开发商的通知——再过三个月，全部拆迁。',
    textEn: 'Rain all evening. The cooler hums. The old neighborhood has three months left before demolition.',
    next: 'intro_3',
  },
  intro_3: {
    id: 'intro_3',
    speaker: null,
    textZh: '叮——',
    textEn: 'Ding —',
    next: 'g_enter',
  },

  // ═══════════════════════════════════════════════════════════
  //  Algram  吉他手/外卖骑手
  //  Flags: g_shared, aichen_honest, g_warm
  // ═══════════════════════════════════════════════════════════

  g_enter: {
    id: 'g_enter',
    character: 'guitarist',
    position: 'right',
    emotion: 'normal',
    speaker: null,
    textZh: '一个外卖骑手推门进来，头盔还挂在手上，外卖背心湿了一半。他把最后一单货放在门口，却没有立刻离开。',
    textEn: 'A delivery rider comes in, helmet still in hand, vest half-soaked. He sets down his last delivery but doesn\'t leave.',
    next: 'g_1',
  },
  g_1: {
    id: 'g_1',
    character: 'guitarist',
    position: 'right',
    emotion: 'normal',
    speaker: 'Algram',
    textZh: '……买包烟。',
    textEn: '...Pack of cigarettes.',
    next: 'g_2',
  },
  g_2: {
    id: 'g_2',
    character: 'guitarist',
    position: 'right',
    emotion: 'sad',
    speaker: null,
    textZh: '他付了钱，把烟揣进口袋，却靠在了冷柜旁边。他的眼神往窗外漂，像在看什么，又像什么都没在看。',
    textEn: 'He pays, pockets the cigarettes, but leans against the cooler. His gaze drifts to the window — looking at something, or nothing.',
    next: 'g_choice1',
  },
  g_choice1: {
    id: 'g_choice1',
    character: 'guitarist',
    position: 'right',
    emotion: 'sad',
    speaker: null,
    textZh: '你看了他一眼。',
    textEn: 'You watch him a moment.',
    choices: [
      { labelZh: '"你住附近？"', labelEn: '"Do you live nearby?"', next: 'g_A1', flag: 'g_shared' },
      { labelZh: '"今晚单子多吗。"', labelEn: '"Busy night?"', next: 'g_A1_alt', flag: 'g_shared' },
      { labelZh: '（不打扰他）', labelEn: '(Leave him be)', next: 'g_B1' },
    ],
  },

  // ── Branch A: 开口问他 ────────────────────────────────────

  g_A1: {
    id: 'g_A1',
    character: 'guitarist',
    position: 'right',
    emotion: 'surprised',
    speaker: 'Algram',
    textZh: '……以前住。不住了。',
    textEn: '...Used to. Not anymore.',
    next: 'g_A2',
  },
  g_A1_alt: {
    id: 'g_A1_alt',
    character: 'guitarist',
    position: 'right',
    emotion: 'normal',
    speaker: 'Algram',
    textZh: '还好。最后一单偏偏是这条街。',
    textEn: 'Not bad. Last delivery happened to be on this street.',
    next: 'g_A2',
  },
  g_A2: {
    id: 'g_A2',
    character: 'guitarist',
    position: 'right',
    emotion: 'sad',
    speaker: 'Algram',
    textZh: '……要拆了，是吗。这条街。',
    textEn: '...They\'re tearing it down. This street.',
    next: 'g_A3',
  },
  g_A3: {
    id: 'g_A3',
    character: 'guitarist',
    position: 'right',
    emotion: 'sad',
    speaker: null,
    textZh: '他低头看了看自己的手。骑手的手，有一个老茧，是长年握琴弦留下的。',
    textEn: 'He looks at his hand. A rider\'s hand — but one old callus, from years on guitar strings.',
    next: 'g_choice2',
  },
  g_choice2: {
    id: 'g_choice2',
    character: 'guitarist',
    position: 'right',
    emotion: 'sad',
    speaker: null,
    textZh: '你想知道他为什么还站在这里。',
    textEn: 'You want to know why he\'s still standing here.',
    choices: [
      { labelZh: '"这里还有什么人吗？"', labelEn: '"Is someone still here you\'re thinking about?"', next: 'g_A4', flag: 'aichen_honest' },
      { labelZh: '"你以前在这里做什么？"', labelEn: '"What did you do here before?"', next: 'g_A4_alt' },
      { labelZh: '"下这么大雨，先进来坐坐吧。"', labelEn: '"Heavy rain. You can stay a bit."', next: 'g_A5', flag: 'g_warm' },
    ],
  },
  g_A4: {
    id: 'g_A4',
    character: 'guitarist',
    position: 'right',
    emotion: 'sad',
    speaker: 'Algram',
    textZh: '……有个人。左转两条街，蓝色门的那栋楼。以前住在那里。我们……两年前的事了。',
    textEn: '...Someone. Two blocks left, blue door building. Used to live there. We... it was two years ago.',
    next: 'g_A4b',
    flag: 'aichen_honest',
  },
  g_A4_alt: {
    id: 'g_A4_alt',
    character: 'guitarist',
    position: 'right',
    emotion: 'sad',
    speaker: 'Algram',
    textZh: '……弹吉他。有个小乐队，在南街地下室排练。后来散了。',
    textEn: '...Guitar. Small band, rehearsed in the basement on South Street. Disbanded eventually.',
    next: 'g_A4c',
  },
  g_A4b: {
    id: 'g_A4b',
    character: 'guitarist',
    position: 'right',
    emotion: 'sad',
    speaker: 'Algram',
    textZh: '我当时说要走去闯，她叫我别走。我走了。没什么大道理，就是走了。',
    textEn: 'I said I needed to leave and try something. She asked me not to. I left anyway. No grand reason. Just left.',
    next: 'g_A5',
  },
  g_A4c: {
    id: 'g_A4c',
    character: 'guitarist',
    position: 'right',
    emotion: 'normal',
    speaker: null,
    textZh: '他说得很平，像是说别人的故事。但他的手攥紧了一下。',
    textEn: 'He says it evenly, like someone else\'s story. But his hand tightens.',
    next: 'g_A5',
  },
  g_A5: {
    id: 'g_A5',
    character: 'guitarist',
    position: 'right',
    emotion: 'normal',
    speaker: null,
    textZh: '你看着他。',
    textEn: 'You look at him.',
    choices: [
      { labelZh: '"去敲那扇蓝色的门。"', labelEn: '"Go knock on that blue door."', next: 'g_encourage', flag: 'g_warm' },
      { labelZh: '"有些事不说完，就会一直欠着。"', labelEn: '"Some things stay a debt until you say them."', next: 'g_encourage', flag: 'g_warm' },
      { labelZh: '"……都这个时候了。"', labelEn: '"...It\'s pretty late."', next: 'g_neutral' },
    ],
  },
  g_encourage: {
    id: 'g_encourage',
    character: 'guitarist',
    position: 'right',
    emotion: 'surprised',
    speaker: 'Algram',
    textZh: '……',
    textEn: '......',
    next: 'g_encourage2',
  },
  g_encourage2: {
    id: 'g_encourage2',
    character: 'guitarist',
    position: 'right',
    emotion: 'happy',
    speaker: 'Algram',
    textZh: '你是第一个这么说的。（他笑了，像是卸下了什么。）谢谢。',
    textEn: 'You\'re the first person to say that. (He smiles — like something releases.) Thanks.',
    next: 'g_exit_A',
  },
  g_neutral: {
    id: 'g_neutral',
    character: 'guitarist',
    position: 'right',
    emotion: 'sad',
    speaker: 'Algram',
    textZh: '……嗯。是挺晚了。（他停了一会儿。）没事，我先走了。',
    textEn: '...Yeah. Pretty late. (He pauses.) Never mind. I\'ll head out.',
    next: 'g_exit_A',
  },
  g_exit_A: {
    id: 'g_exit_A',
    character: 'guitarist',
    position: 'right',
    emotion: 'normal',
    speaker: null,
    textZh: '他把头盔戴上，在口袋里翻了翻，拿出一张演出传单放在收银台上。"这个月底，南街地下室。要是有兴趣的话。"然后推门走进雨里。',
    textEn: 'He puts on his helmet, rummages in his pocket, and leaves a flyer on the counter. "End of this month. The basement on South Street. If you\'re interested." Then he walks back into the rain.',
    next: 'c_intro',
  },

  // ── Branch B: 不打扰他 ────────────────────────────────────

  g_B1: {
    id: 'g_B1',
    character: 'guitarist',
    position: 'right',
    emotion: 'normal',
    speaker: null,
    textZh: '你没有多问。他站了一会儿，点上一根烟，在门口抽完，把烟蒂摁灭在门外的烟灰缸里，走了。',
    textEn: 'You don\'t ask. He stands a while, lights a cigarette at the door, finishes it, stubs it out in the ashtray outside, and goes.',
    next: 'c_intro',
  },

  // ═══════════════════════════════════════════════════════════
  //  Jenny  城市史研究生
  //  Flags: c_connected, c_stayed, suli_forgave, suli_recorded
  //         suli_confronted_dad, archive_key, petition_signed, fangming_letter
  // ═══════════════════════════════════════════════════════════

  c_intro: {
    id: 'c_intro',
    speaker: null,
    textZh: '凌晨一点。',
    textEn: 'One in the morning.',
    next: 'c_enter',
  },
  c_enter: {
    id: 'c_enter',
    character: 'coder',
    position: 'right',
    emotion: 'normal',
    speaker: null,
    textZh: '一个女生抱着一叠资料走进来，外套上还沾着雨水。她把资料放在靠窗的桌上，摘下眼镜擦了擦，动作很熟练，像是常来。',
    textEn: 'A woman comes in with a stack of files, rain still on her coat. She sets them on the window table, takes off her glasses to wipe them — practiced, like she\'s been here before.',
    next: 'c_flyer_notice',
  },
  // CONDITIONAL — 注意到Algram的传单
  c_flyer_notice: {
    id: 'c_flyer_notice',
    character: 'coder',
    position: 'right',
    emotion: 'surprised',
    condition: 'aichen_honest',
    speaker: null,
    textZh: '她经过收银台时，眼神落在那张演出传单上，停了一秒。她把传单拿起来，沉默地看着。',
    textEn: 'Passing the counter, her gaze catches the flyer. She picks it up and reads it in silence.',
    next: 'c_flyer_choice',
  },
  c_flyer_choice: {
    id: 'c_flyer_choice',
    character: 'coder',
    position: 'right',
    emotion: 'sad',
    condition: 'aichen_honest',
    next: 'c_1',
    speaker: null,
    textZh: '她的手指压在传单上，没有放开。',
    textEn: 'Her fingers press on the flyer and don\'t let go.',
    choices: [
      { labelZh: '"你认识他？"', labelEn: '"You know him?"', next: 'c_flyer_A', flag: 'suli_forgave' },
      { labelZh: '（没有说什么）', labelEn: '(Say nothing)', next: 'c_1' },
    ],
  },
  c_flyer_A: {
    id: 'c_flyer_A',
    character: 'coder',
    position: 'right',
    emotion: 'sad',
    speaker: 'Jenny',
    textZh: '……以前认识。（她把传单放回去，很轻，像在放一件容易碎的东西。）他还在骑车啊。',
    textEn: '...Used to. (She sets it back, gently, like something breakable.) Still riding, huh.',
    next: 'c_flyer_A2',
    flag: 'suli_forgave',
  },
  c_flyer_A2: {
    id: 'c_flyer_A2',
    character: 'coder',
    position: 'right',
    emotion: 'normal',
    speaker: 'Jenny',
    textZh: '没事。（她重新整理起资料，声音恢复平稳。）有热水吗。',
    textEn: 'It\'s fine. (She straightens her files, voice steady again.) Do you have hot water.',
    next: 'c_1',
  },
  c_1: {
    id: 'c_1',
    character: 'coder',
    position: 'right',
    emotion: 'normal',
    speaker: 'Jenny',
    textZh: '我在写关于这条街的历史。老地图、老照片，还有居民口述。三个月后这里就拆了，我想在拆之前留下一份记录。',
    textEn: 'I\'m writing the history of this street. Old maps, photos, resident accounts. Three months before it\'s gone — I want to leave a record.',
    next: 'c_choice1',
  },
  c_choice1: {
    id: 'c_choice1',
    character: 'coder',
    position: 'right',
    emotion: 'normal',
    speaker: null,
    textZh: '她摊开一张旧地图，1984年的。这家店，在地图上标着"37号糖果铺"。',
    textEn: 'She unfolds an old map from 1984. This store is marked "Candy Shop No. 37."',
    choices: [
      { labelZh: '"1984年的糖果铺？"', labelEn: '"A candy shop in 1984?"', next: 'c_A1', flag: 'c_stayed' },
      { labelZh: '"我去后室找找，也许有旧东西。"', labelEn: '"Let me check the back room — might be something old."', next: 'c_backroom', flag: 'c_connected' },
      { labelZh: '"这里有请愿书，反对拆迁的。"', labelEn: '"There\'s a petition here, against the demolition."', next: 'c_petition' },
    ],
  },

  // ── Branch A: 问1984年的事 ────────────────────────────────

  c_A1: {
    id: 'c_A1',
    character: 'coder',
    position: 'right',
    emotion: 'happy',
    speaker: 'Jenny',
    textZh: '对。开了二十年，1984年开的。老板娘叫陈玉兰，一个人撑着。街坊们管她叫"兰姐"。',
    textEn: 'Yes. Open for twenty years, started in 1984. The owner was a woman named Chen Yulan — everyone called her Sister Lan.',
    next: 'c_A2',
    flag: 'c_stayed',
  },
  c_A2: {
    id: 'c_A2',
    character: 'coder',
    position: 'right',
    emotion: 'sad',
    speaker: 'Jenny',
    textZh: '2004年关的。我找到了一些她的手迹——账本、信件。有一封信写好了，没有寄出去。我猜是最后一天写的。',
    textEn: 'Closed in 2004. I found some of her handwriting — ledgers, letters. One letter written but never sent. I think it was from the last day.',
    next: 'c_A3',
  },
  c_A3: {
    id: 'c_A3',
    character: 'coder',
    position: 'right',
    emotion: 'normal',
    speaker: 'Jenny',
    textZh: '信现在应该还在后室。老板说他从没整理过那里。',
    textEn: 'The letter should still be in the back room. The owner said he\'s never sorted through it.',
    next: 'c_A4',
  },
  c_A4: {
    id: 'c_A4',
    character: 'coder',
    position: 'right',
    emotion: 'normal',
    speaker: null,
    textZh: '她把资料整理好，压低声音说：',
    textEn: 'She tidies her files, and says quietly:',
    choices: [
      { labelZh: '"我们去找找。"', labelEn: '"Let\'s go look."', next: 'c_backroom', flag: 'c_connected' },
      { labelZh: '"等老板出来，问他。"', labelEn: '"Wait for the owner to come out."', next: 'c_wait' },
    ],
  },

  // ── 后室 ──────────────────────────────────────────────────

  c_backroom: {
    id: 'c_backroom',
    character: 'coder',
    position: 'right',
    emotion: 'surprised',
    scene: 'backroom',
    speaker: null,
    textZh: '后室的门是虚掩着的。你们进去，里面堆满了纸箱，角落里有个旧铁皮文件柜，生了锈。Jenny打开手机灯。',
    textEn: 'The back room door is ajar. Inside: stacked boxes, an old metal filing cabinet rusted in the corner. Jenny turns on her phone light.',
    next: 'c_backroom2',
    flag: 'c_connected',
  },
  c_backroom2: {
    id: 'c_backroom2',
    character: 'coder',
    position: 'right',
    emotion: 'surprised',
    speaker: 'Jenny',
    textZh: '这里……（她打开铁皮柜，第一抽屉里是一把旧铜钥匙，标签上写着"城市档案馆 32号"。）你认识这把钥匙？',
    textEn: 'There\'s... (She opens the cabinet. Top drawer: an old brass key, labeled "City Archive Room 32.") Do you know this key?',
    next: 'c_backroom3',
    flag: 'archive_key',
  },
  c_backroom3: {
    id: 'c_backroom3',
    character: 'coder',
    position: 'right',
    emotion: 'happy',
    speaker: 'Jenny',
    textZh: '32号是这片街区的独立档案室。已经关了十几年了，但里面还有东西——我一直找不到进去的钥匙。',
    textEn: 'Room 32 is the neighborhood\'s private archive. Closed for years, but there\'s still material inside. I\'ve been looking for this key.',
    next: 'c_letters',
  },
  c_letters: {
    id: 'c_letters',
    character: 'coder',
    position: 'right',
    emotion: 'normal',
    speaker: null,
    textZh: '她继续往下翻，第二抽屉里是一摞信件，用橡皮筋捆着。收件人：Jenny，转交Jenny妈妈。寄件人：JM·F。',
    textEn: 'She continues. Second drawer: a bundle of letters, rubber-banded together. Addressee: Jenny, care of Jenny\'s mother. Sender: JM·F.',
    next: 'c_letters2',
  },
  c_letters2: {
    id: 'c_letters2',
    character: 'coder',
    position: 'right',
    emotion: 'surprised',
    speaker: null,
    textZh: 'Jenny的手停住了。橡皮筋很旧，一碰就断了。最早的一封，邮戳是1999年。最晚的，2006年。没有一封寄出去过。',
    textEn: 'Jenny\'s hands go still. The rubber band is old, snaps when she touches it. The earliest letter: 1999. The latest: 2006. Not one was sent.',
    next: 'c_letters3',
    flag: 'fangming_letter',
  },
  c_letters3: {
    id: 'c_letters3',
    character: 'coder',
    position: 'right',
    emotion: 'sad',
    speaker: 'Jenny',
    textZh: '（她把信放回去，很小心，重新捆好。）……我需要一点时间。',
    textEn: '(She puts them back carefully, re-bundles them.) ...I need a minute.',
    next: 'c_exit',
  },

  // ── 请愿书 ────────────────────────────────────────────────

  c_petition: {
    id: 'c_petition',
    character: 'coder',
    position: 'right',
    emotion: 'normal',
    speaker: 'Jenny',
    textZh: '（她拿起请愿书，没有犹豫，签了名。）历史记录有用，但这个更直接。',
    textEn: '(She takes the petition, doesn\'t hesitate, signs.) Historical records matter, but this is more direct.',
    next: 'c_petition2',
    flag: 'petition_signed',
  },
  c_petition2: {
    id: 'c_petition2',
    character: 'coder',
    position: 'right',
    emotion: 'normal',
    speaker: 'Jenny',
    textZh: '我可以帮你联系这条街以前的居民。我做过访谈，有联系方式。他们知道这里要拆，很多人都想说点什么。',
    textEn: 'I can contact former residents for you. I\'ve done interviews, I have their details. They know it\'s coming down — many want to say something.',
    next: 'c_exit',
  },

  // ── 等待 ─────────────────────────────────────────────────

  c_wait: {
    id: 'c_wait',
    character: 'coder',
    position: 'right',
    emotion: 'normal',
    speaker: 'Jenny',
    textZh: '好。（她回到桌边继续整理资料，偶尔抬头看向后室那扇门。）',
    textEn: 'Okay. (She returns to the table, sorting files, occasionally glancing toward the back room door.)',
    next: 'c_exit',
  },

  // ── 共同出口 ──────────────────────────────────────────────

  c_exit: {
    id: 'c_exit',
    character: 'coder',
    position: 'right',
    emotion: 'normal',
    scene: 'store',
    speaker: null,
    textZh: '她把所有东西重新收好，问你："老板呢？他今晚在不在？"',
    textEn: 'She packs everything up and asks: "Is the owner here tonight?"',
    next: 'c_exit2',
  },
  c_exit2: {
    id: 'c_exit2',
    character: 'coder',
    position: 'right',
    emotion: 'normal',
    speaker: null,
    textZh: '你说他在后室。她点点头，坐回窗边，没有离开。',
    textEn: 'You say he\'s in the back. She nods, sits back by the window, and doesn\'t leave.',
    next: 'h_intro',
    flag: 'c_stayed',
  },

  // ═══════════════════════════════════════════════════════════
  //  JM·F  便利店老板
  //  Flags: h_soft, h_daughter_known, fangming_explained,
  //         fangming_benefactor, suli_confronted_dad, suli_recorded, letter_opened
  // ═══════════════════════════════════════════════════════════

  h_intro: {
    id: 'h_intro',
    speaker: null,
    textZh: '凌晨两点。后室的灯还亮着。',
    textEn: 'Two in the morning. The light in the back room is still on.',
    next: 'h_enter',
  },
  h_enter: {
    id: 'h_enter',
    character: 'hacker',
    position: 'right',
    emotion: 'normal',
    speaker: null,
    textZh: 'JM·F从后室走出来，手里拿着一个账本，眼镜推在额头上，看见你点了点头，然后扫了一眼店里——',
    textEn: 'JM·F comes out of the back room with a ledger, glasses pushed up on his forehead. He nods at you, then scans the store —',
    next: 'h_suli_meet',
  },
  // CONDITIONAL — Jenny还在
  h_suli_meet: {
    id: 'h_suli_meet',
    character: 'hacker',
    position: 'right',
    emotion: 'surprised',
    condition: 'c_stayed',
    speaker: null,
    textZh: '他和窗边的Jenny对上了眼。两个人都没有说话，像两扇窗突然被风推开，又被什么重新关上。',
    textEn: 'His eyes meet Jenny\'s across the store. Neither speaks — like two windows blown open by wind, then quietly shut again.',
    next: 'h_suli_choice',
  },
  h_suli_choice: {
    id: 'h_suli_choice',
    character: 'hacker',
    position: 'right',
    emotion: 'sad',
    condition: 'c_stayed',
    next: 'h_1',
    speaker: null,
    textZh: '你站在中间。',
    textEn: 'You stand between them.',
    choices: [
      { labelZh: '"你们……认识？"', labelEn: '"Do you two... know each other?"', next: 'h_family_A', flag: 'suli_confronted_dad' },
      { labelZh: '（假装没看见，去擦货架）', labelEn: '(Pretend not to notice, go wipe a shelf)', next: 'h_1' },
    ],
  },
  h_family_A: {
    id: 'h_family_A',
    character: 'coder',
    position: 'left',
    emotion: 'sad',
    condition: 'c_stayed',
    speaker: 'Jenny',
    textZh: '他是我爸。（她说得很平，像在回答"今天天气怎么样"。）1998年他走了，之后就没怎么联系了。',
    textEn: 'He\'s my father. (She says it flatly, like answering about the weather.) He left in 1998. We haven\'t really spoken since.',
    next: 'h_family_B',
    flag: 'suli_confronted_dad',
  },
  h_family_B: {
    id: 'h_family_B',
    character: 'hacker',
    position: 'right',
    emotion: 'sad',
    condition: 'suli_confronted_dad',
    speaker: 'JM·F',
    textZh: 'Jenny……',
    textEn: 'Jenny...',
    next: 'h_family_C',
  },
  h_family_C: {
    id: 'h_family_C',
    character: 'coder',
    position: 'left',
    emotion: 'sad',
    condition: 'suli_confronted_dad',
    speaker: 'Jenny',
    textZh: '你为什么1998年走的。（她终于问出来了，二十多年了。）我一直没有问过你。',
    textEn: 'Why did you leave in 1998. (She finally says it — over twenty years.) I never asked you directly.',
    next: 'h_family_D',
  },
  h_family_D: {
    id: 'h_family_D',
    character: 'hacker',
    position: 'right',
    emotion: 'sad',
    condition: 'suli_confronted_dad',
    speaker: 'JM·F',
    textZh: '……你妈说过吗。（她摇了摇头。）我那时候……出了一些事。不是因为你，不是因为她。是我自己的问题。',
    textEn: '...Did your mother ever say? (She shakes her head.) I... something happened. Not because of you. Not because of her. It was mine.',
    next: 'h_family_E',
    flag: 'fangming_explained',
  },
  h_family_E: {
    id: 'h_family_E',
    character: 'hacker',
    position: 'right',
    emotion: 'sad',
    condition: 'fangming_explained',
    speaker: 'JM·F',
    textZh: '我欠了很多钱。躲债的那几年，我写了很多信，但我不知道怎么寄，也不敢寄。后来还完了，你们已经不需要我了。',
    textEn: 'I was in debt. During those years hiding from creditors, I wrote many letters, but I didn\'t know how to send them. Didn\'t dare. By the time I paid it off, you didn\'t need me anymore.',
    next: 'h_1',
  },
  h_1: {
    id: 'h_1',
    character: 'hacker',
    position: 'right',
    emotion: 'normal',
    speaker: 'JM·F',
    textZh: '（他把账本放在柜台上。）今晚有客人来研究这条街的历史？',
    textEn: '(He sets the ledger on the counter.) Someone researching the street\'s history tonight?',
    next: 'h_choice1',
  },
  h_choice1: {
    id: 'h_choice1',
    character: 'hacker',
    position: 'right',
    emotion: 'normal',
    speaker: null,
    textZh: '你想到了很多。JM·F在这里开了二十年店，这里之前是糖果铺，后室里有信有钥匙，还有今晚来过的那个骑手……',
    textEn: 'You think about everything. JM·F has run this store for twenty years. The candy shop before it. Letters and a key in the back. And the rider who came earlier...',
    choices: [
      { labelZh: '"你在这里开了多久了？"', labelEn: '"How long have you been running this store?"', next: 'h_A1' },
      { labelZh: '"今晚有个骑手，说是你的老朋友。"', labelEn: '"A rider came tonight — said he knew this street."', next: 'h_rider_A' },
      { labelZh: '"后室里有一封1984年的信。"', labelEn: '"There\'s a letter from 1984 in the back room."', next: 'h_letter' },
    ],
  },

  // ── 问历史 ────────────────────────────────────────────────

  h_A1: {
    id: 'h_A1',
    character: 'hacker',
    position: 'right',
    emotion: 'normal',
    speaker: 'JM·F',
    textZh: '2005年。兰姐关了糖果铺，我盘下来的。我那时候刚还完债，身上没什么钱，有个人……帮了我一把。',
    textEn: '2005. Sister Lan closed the candy shop and I took it over. I\'d just paid off my debt, had no money left. Someone... helped me.',
    next: 'h_A2',
  },
  h_A2: {
    id: 'h_A2',
    character: 'hacker',
    position: 'right',
    emotion: 'shy',
    speaker: 'JM·F',
    textZh: '匿名的。到今天也不知道是谁。我查了很多年，没查到。',
    textEn: 'Anonymous. I still don\'t know who. I looked for years. Never found out.',
    next: 'h_A3',
    flag: 'h_soft',
  },
  h_A3: {
    id: 'h_A3',
    character: 'hacker',
    position: 'right',
    emotion: 'normal',
    speaker: null,
    textZh: '他停了停，说：',
    textEn: 'He pauses, then says:',
    choices: [
      { labelZh: '"你帮过别人吗？"', labelEn: '"Have you helped someone else?"', next: 'h_benefactor_q', },
      { labelZh: '"这封信你看过吗？"', labelEn: '"Have you read that letter?"', next: 'h_letter' },
    ],
  },
  h_benefactor_q: {
    id: 'h_benefactor_q',
    character: 'hacker',
    position: 'right',
    emotion: 'shy',
    speaker: 'JM·F',
    textZh: '……帮过一个年轻人。六年前，有个外卖骑手，晚上在这里坐了很久。他说想学程序，但没有钱买电脑。我就……匿名转了他一台二手的。',
    textEn: '...I helped one person. Six years ago, a young delivery rider sat here for a long time. He said he wanted to learn coding but couldn\'t afford a computer. I anonymously arranged a second-hand one.',
    next: 'h_benefactor_q2',
    flag: 'fangming_benefactor',
  },
  h_benefactor_q2: {
    id: 'h_benefactor_q2',
    character: 'hacker',
    position: 'right',
    emotion: 'normal',
    speaker: 'JM·F',
    textZh: '以为只是一时好心。后来也没再见过那个人。',
    textEn: 'I thought it was just a passing impulse. Never saw him again.',
    next: 'h_benefactor_reveal',
  },
  h_benefactor_reveal: {
    id: 'h_benefactor_reveal',
    character: 'hacker',
    position: 'right',
    emotion: 'normal',
    condition: 'aichen_honest',
    next: 'h_exit',
    speaker: null,
    textZh: '你想到了今晚那个骑手。手上的吉他茧，他说学过程序……',
    textEn: 'You think of tonight\'s rider. The guitar callus. He mentioned learning to code...',
    choices: [
      { labelZh: '"今晚那个骑手……我觉得就是他。"', labelEn: '"Tonight\'s rider... I think that was him."', next: 'h_benefactor_reveal2' },
      { labelZh: '（什么都没说）', labelEn: '(Say nothing)', next: 'h_exit' },
    ],
  },
  h_benefactor_reveal2: {
    id: 'h_benefactor_reveal2',
    character: 'hacker',
    position: 'right',
    emotion: 'surprised',
    speaker: 'JM·F',
    textZh: '……什么。（他放下账本。）他叫什么名字。',
    textEn: '...What. (He sets down the ledger.) What\'s his name.',
    next: 'h_benefactor_reveal3',
  },
  h_benefactor_reveal3: {
    id: 'h_benefactor_reveal3',
    character: 'hacker',
    position: 'right',
    emotion: 'sad',
    speaker: null,
    textZh: 'JM·F看了一会儿那张传单。他把眼镜摘下来，慢慢擦了擦。',
    textEn: 'JM·F looks at the flyer for a long time. He takes off his glasses and slowly wipes them.',
    next: 'h_exit',
  },

  // ── 问1984的信 ────────────────────────────────────────────

  h_letter: {
    id: 'h_letter',
    character: 'hacker',
    position: 'right',
    emotion: 'normal',
    speaker: 'JM·F',
    textZh: '那封信我知道。兰姐写的。我一直没有打开，觉得……不是我该看的。',
    textEn: 'I know that letter. Sister Lan wrote it. I never opened it — felt like... not mine to read.',
    next: 'h_letter2',
  },
  h_letter2: {
    id: 'h_letter2',
    character: 'hacker',
    position: 'right',
    emotion: 'normal',
    speaker: null,
    textZh: '他想了一下。',
    textEn: 'He considers.',
    choices: [
      { labelZh: '"你现在想打开吗。"', labelEn: '"Do you want to open it now."', next: 'h_open_letter' },
      { labelZh: '"你保留它，就够了。"', labelEn: '"Keeping it is enough."', next: 'h_exit' },
    ],
  },
  h_open_letter: {
    id: 'h_open_letter',
    character: 'hacker',
    position: 'right',
    emotion: 'sad',
    speaker: 'JM·F',
    textZh: '……也许现在可以了。',
    textEn: '...Maybe now it\'s time.',
    next: 'h_open_letter2',
  },
  h_open_letter2: {
    id: 'h_open_letter2',
    character: 'hacker',
    position: 'right',
    emotion: 'sad',
    speaker: null,
    textZh: '他去后室拿出那封信，拆开，放在收银台上。信纸已经泛黄了。上面写着：\n\n"如果有一天，有人还在这里，就告诉他们：这个地方，我不后悔。"\n\n落款：陈玉兰，2004年11月。',
    textEn: 'He gets the letter from the back room, opens it, sets it on the counter. The paper is yellowed.\n\nIt reads:\n\n"If someone is still here someday, tell them: this place — I have no regrets."\n\nSigned: Chen Yulan, November 2004.',
    next: 'h_open_letter3',
    flag: 'letter_opened',
  },
  h_open_letter3: {
    id: 'h_open_letter3',
    character: 'hacker',
    position: 'right',
    emotion: 'happy',
    speaker: 'JM·F',
    textZh: '（他把信叠好，放进口袋。）好。',
    textEn: '(He folds the letter, pockets it.) Good.',
    next: 'h_record',
  },

  // ── 口述录音 ──────────────────────────────────────────────

  h_rider_A: {
    id: 'h_rider_A',
    character: 'hacker',
    position: 'right',
    emotion: 'normal',
    speaker: 'JM·F',
    textZh: '骑手。（他想了想。）这条街的老熟面孔多，我记不清了。',
    textEn: 'A rider. (He thinks.) This street had many regulars — I can\'t keep track anymore.',
    next: 'h_A1',
  },

  h_record: {
    id: 'h_record',
    character: 'hacker',
    position: 'right',
    emotion: 'normal',
    condition: 'c_stayed',
    speaker: null,
    textZh: 'Jenny从包里拿出录音笔，放在柜台上，看着JM·F。"如果你愿意，我可以录下来。关于这条街的事。"',
    textEn: 'Jenny takes out a voice recorder, sets it on the counter, and looks at JM·F. "If you\'re willing, I can record it. About this street."',
    next: 'h_record2',
  },
  h_record2: {
    id: 'h_record2',
    character: 'hacker',
    position: 'right',
    emotion: 'shy',
    condition: 'c_stayed',
    speaker: 'JM·F',
    textZh: '（他看着那支录音笔，看了很久。）……好。从什么时候开始说？',
    textEn: '(He stares at the recorder for a long time.) ...Alright. Where do I start?',
    next: 'h_record3',
    flag: 'suli_recorded',
  },
  h_record3: {
    id: 'h_record3',
    character: 'coder',
    position: 'left',
    emotion: 'happy',
    condition: 'suli_recorded',
    speaker: 'Jenny',
    textZh: '从你第一次走进这条街开始。',
    textEn: 'Start from the first time you walked onto this street.',
    next: 'h_exit',
  },

  h_exit: {
    id: 'h_exit',
    character: 'hacker',
    position: 'right',
    emotion: 'normal',
    speaker: 'JM·F',
    textZh: '（他看了看墙上的钟。凌晨两点四十。他把账本推到一边。）今晚的账先不算了。',
    textEn: '(He glances at the wall clock. Two-forty. He pushes the ledger aside.) Tonight\'s accounts can wait.',
    next: 'gh_intro',
  },

  // ═══════════════════════════════════════════════════════════
  //  幽灵  1984年的见证者
  //  Flags: ghost_seen, ghost_told, h_daughter_known
  // ═══════════════════════════════════════════════════════════

  gh_intro: {
    id: 'gh_intro',
    speaker: null,
    textZh: '凌晨三点。雨小了。店里安静到像另一个时空。',
    textEn: 'Three in the morning. The rain eases. The store feels like a different time.',
    next: 'gh_enter',
  },
  gh_enter: {
    id: 'gh_enter',
    speaker: null,
    textZh: '叮——门铃响了。门没有开。',
    textEn: 'Ding — the chime sounds. The door does not open.',
    next: 'gh_appear',
  },
  gh_appear: {
    id: 'gh_appear',
    character: 'ghost',
    position: 'center',
    emotion: 'normal',
    speaker: null,
    textZh: '收银台旁边，光线里有什么东西聚集起来。一个女孩的轮廓，半透明的，旧式的衣服，头发在没有风的地方轻轻飘着。',
    textEn: 'Something gathers in the light beside the counter. A girl\'s outline — translucent, old clothes, hair drifting in air without wind.',
    next: 'gh_1',
  },
  gh_1: {
    id: 'gh_1',
    character: 'ghost',
    position: 'center',
    emotion: 'normal',
    speaker: 'ghostpixel',
    textZh: '……你能看见我吗。',
    textEn: '...Can you see me.',
    choices: [
      { labelZh: '"能。"', labelEn: '"Yes."', next: 'gh_A1', flag: 'ghost_seen' },
      { labelZh: '（继续擦柜台，假装没看见）', labelEn: '(Keep wiping the counter)', next: 'gh_B1' },
    ],
  },

  // ── Branch A: 承认看见了 ──────────────────────────────────

  gh_A1: {
    id: 'gh_A1',
    character: 'ghost',
    position: 'center',
    emotion: 'surprised',
    speaker: 'ghostpixel',
    textZh: '真的可以。（她愣了一秒，像是不敢相信。）好久了，好久没有人能看见我了。',
    textEn: 'You really can. (She pauses, like she can\'t believe it.) It\'s been so long. So long since anyone could see me.',
    next: 'gh_A2',
    flag: 'ghost_seen',
  },
  gh_A2: {
    id: 'gh_A2',
    character: 'ghost',
    position: 'center',
    emotion: 'happy',
    speaker: 'ghostpixel',
    textZh: '这里以前是兰姐的糖果铺。我小时候住在这条街上，每次来她都会给我留一颗薄荷糖。1984年的事了。',
    textEn: 'This used to be Sister Lan\'s candy shop. I grew up on this street — she always saved a mint candy for me. That was 1984.',
    next: 'gh_A3',
  },
  gh_A3: {
    id: 'gh_A3',
    character: 'ghost',
    position: 'center',
    emotion: 'sad',
    speaker: 'ghostpixel',
    textZh: '铺子关了以后我就没地方去了。就……在这附近。几十年了。',
    textEn: 'After the shop closed I had nowhere to go. I just... stayed nearby. Decades now.',
    next: 'gh_knows_g',
  },
  // CONDITIONAL — 如果Algram开口说过
  gh_knows_g: {
    id: 'gh_knows_g',
    character: 'ghost',
    position: 'center',
    emotion: 'normal',
    condition: 'aichen_honest',
    speaker: 'ghostpixel',
    textZh: '今晚那个骑手……他在门口站了很久。我见过他，不止一次。每次他来这条街，都是那种表情——像是在找什么，又不确定找不找得到。',
    textEn: 'That rider tonight... he stood outside for a long time. I\'ve seen him before. Every time he comes to this street, he has that look — searching for something, not sure he\'ll find it.',
    next: 'gh_knows_c',
  },
  // CONDITIONAL — 如果Jenny留下来了
  gh_knows_c: {
    id: 'gh_knows_c',
    character: 'ghost',
    position: 'center',
    emotion: 'normal',
    condition: 'c_stayed',
    speaker: 'ghostpixel',
    textZh: '那个研究历史的女生……她手里拿着的旧地图，我认识那张地图。那是兰姐画的，1984年。',
    textEn: 'That woman researching history... the old map she was holding — I know that map. Sister Lan drew it, 1984.',
    next: 'gh_knows_h',
  },
  // CONDITIONAL — 如果Jenny和JM·F相认了
  gh_knows_h: {
    id: 'gh_knows_h',
    character: 'ghost',
    position: 'center',
    emotion: 'sad',
    condition: 'fangming_explained',
    speaker: 'ghostpixel',
    textZh: '还有那个老板……我知道他。他在这里一个人过了很多年。女儿在外面，他在里面。隔着一扇墙那么近，又那么远。',
    textEn: 'And the owner... I know him. He\'s spent so many years here alone. His daughter outside, him inside. So close — just one wall — and so far.',
    next: 'gh_daughter_link',
    flag: 'h_daughter_known',
  },
  gh_daughter_link: {
    id: 'gh_daughter_link',
    character: 'ghost',
    position: 'center',
    emotion: 'sad',
    condition: 'h_daughter_known',
    speaker: 'ghostpixel',
    textZh: '而那个女生……就是他的女儿，对吗。（她轻声说，不像是在问，更像是终于把一件事说出口。）我看着他们今晚，想着如果兰姐还在，她一定会把他们推到一起。',
    textEn: 'And that woman... she\'s his daughter, isn\'t she. (She says it softly, less a question than something finally said.) Watching them tonight — I think if Sister Lan were here, she\'d push them together.',
    next: 'gh_choice',
  },
  gh_choice: {
    id: 'gh_choice',
    character: 'ghost',
    position: 'center',
    emotion: 'normal',
    speaker: 'ghostpixel',
    textZh: '你不害怕吗？',
    textEn: 'Aren\'t you afraid?',
    choices: [
      { labelZh: '"不害怕。你很久没有人说话了，对吗。"', labelEn: '"No. You\'ve been alone a long time, haven\'t you."', next: 'gh_kind', flag: 'ghost_told' },
      { labelZh: '"……有一点。但没关系。"', labelEn: '"...A little. But it\'s okay."', next: 'gh_honest' },
      { labelZh: '"你可以走了，你知道吗。"', labelEn: '"You can go, you know. You can leave."', next: 'gh_leave', flag: 'ghost_told' },
    ],
  },
  gh_kind: {
    id: 'gh_kind',
    character: 'ghost',
    position: 'center',
    emotion: 'happy',
    speaker: 'ghostpixel',
    textZh: '……是。很久了。（她笑了，是那种轻的、透明的笑。）谢谢你。',
    textEn: '...Yes. A long time. (She smiles — light, transparent.) Thank you.',
    next: 'gh_final',
    flag: 'ghost_told',
  },
  gh_honest: {
    id: 'gh_honest',
    character: 'ghost',
    position: 'center',
    emotion: 'shy',
    speaker: 'ghostpixel',
    textZh: '……大多数人都怕的，然后跑掉了。你是第一个说"没关系"的。',
    textEn: '...Most people are frightened and run. You\'re the first to say it\'s okay.',
    next: 'gh_final',
  },
  gh_leave: {
    id: 'gh_leave',
    character: 'ghost',
    position: 'center',
    emotion: 'sad',
    speaker: 'ghostpixel',
    textZh: '……（沉默了很久。）我不知道去哪里。',
    textEn: '...（Long silence.）I don\'t know where to go.',
    next: 'gh_leave2',
  },
  gh_leave2: {
    id: 'gh_leave2',
    character: 'ghost',
    position: 'center',
    emotion: 'happy',
    speaker: 'ghostpixel',
    textZh: '但你说可以的话……我想试试。（她往门口飘了一步。）这里的灯，会一直亮着吗？',
    textEn: 'But if you say it\'s okay... I\'ll try. (She drifts a step toward the door.) Will the lights stay on here?',
    next: 'gh_leave3',
    flag: 'ghost_told',
  },
  gh_leave3: {
    id: 'gh_leave3',
    character: 'ghost',
    position: 'center',
    emotion: 'happy',
    speaker: null,
    textZh: '你说：会的。她点了点头，走向玻璃门，透过去了，消失在雨后的街道上。柜台上不知什么时候多了一颗薄荷糖，旧式包装，繁体字。',
    textEn: 'You say: yes. She nods, walks toward the glass door, passes through it, disappears into the wet street. Somehow there\'s a mint candy on the counter — old wrapper, traditional characters.',
    next: 'ending_dawn',
  },
  gh_final: {
    id: 'gh_final',
    character: 'ghost',
    position: 'center',
    emotion: 'happy',
    speaker: 'ghostpixel',
    textZh: '今晚来了好多人。每个人都带着自己的事，但好像也是来这里的。（她往门边飘了飘。）你是个好店员。',
    textEn: 'So many people tonight. Everyone carrying their own thing — but it feels like they all came here for a reason. (She drifts toward the door.) You\'re a good clerk.',
    next: 'ending_dawn',
  },

  // ── Branch B: 假装没看见 ──────────────────────────────────

  gh_B1: {
    id: 'gh_B1',
    character: 'ghost',
    position: 'center',
    emotion: 'sad',
    speaker: 'ghostpixel',
    textZh: '……',
    textEn: '......',
    next: 'gh_B2',
  },
  gh_B2: {
    id: 'gh_B2',
    speaker: null,
    textZh: '她在货架间飘了一会儿，在糖果区站了很久，然后安静地消散了，就好像从未来过。',
    textEn: 'She drifts through the aisles, lingers at the candy section, then quietly dissolves — as if she was never there.',
    next: 'ending_dawn',
  },

  // ═══════════════════════════════════════════════════════════
  //  结局桥接
  // ═══════════════════════════════════════════════════════════

  ending_dawn: {
    id: 'ending_dawn',
    speaker: null,
    scene: 'dawn',
    textZh: '天，快亮了。',
    textEn: 'Dawn is almost here.',
    endingBranch: true,
    textZh2: '', textEn2: '',
  } as StoryBeat,

  // ═══════════════════════════════════════════════════════════
  //  八个结局
  // ═══════════════════════════════════════════════════════════

  // ── 1. 熄灯（默认）────────────────────────────────────────
  ending_lights_out: {
    id: 'ending_lights_out',
    speaker: null,
    textZh: '雨停了。天色泛白。',
    textEn: 'Rain stops. Sky lightens.',
    pages: [
      { textZh: '来了几个人，又走了几个人。各有各的事，各有各的夜。你合上账本，关了一盏多余的灯。', textEn: 'Some people came. Some people left. Each with their own thing, their own night. You close the ledger, switch off an extra light.' },
      { textZh: '便利店的灯亮着，不为任何人，只是亮着。', textEn: 'The store stays lit. Not for anyone in particular. Just lit.' },
    ],
  },

  // ── 2. 档案（知识结局）───────────────────────────────────
  ending_archive: {
    id: 'ending_archive',
    speaker: null,
    textZh: '三个月后，37号便利店被拆了。但在拆之前，Jenny用城市档案馆32号室的钥匙打开了一扇门。',
    textEn: 'Three months later, Store No. 37 came down. But before it did, Jenny used the archive key to open Room 32.',
    pages: [
      { textZh: '里面有三十年的街区记录——照片、手稿、账本。她的论文最后引用了陈玉兰那封信："这个地方，我不后悔。"', textEn: 'Inside: thirty years of neighborhood records. Photos, manuscripts, ledgers. Her thesis quoted Sister Lan\'s letter: "This place — I have no regrets."' },
      { textZh: '37号不在了，但档案室里，它还是1984年的样子。', textEn: 'No. 37 is gone. But in the archive room, it\'s still 1984.' },
    ],
  },

  // ── 3. 还清了（债务结局）─────────────────────────────────
  ending_debt: {
    id: 'ending_debt',
    speaker: null,
    textZh: 'JM·F从后室拿出一个旧账本，翻到某一页，推给Algram。',
    textEn: 'JM·F brings an old ledger from the back, opens to a page, slides it to Algram.',
    pages: [
      { textZh: '那是六年前一笔匿名转账的记录。金额不大，但那台二手电脑，让一个骑手开始学了代码，组了乐队，在南街地下室演出。', textEn: 'A record of an anonymous transfer, six years ago. Not a large sum — but that computer let a rider learn to code, form a band, play a basement on South Street.' },
      { textZh: 'Algram盯着账本很久，说："是你。"\n\nJM·F说："账清了。"\n\nAlgram没有说谢谢，但他留下来，帮JM·F关了店。', textEn: 'Algram stares for a long time. "It was you."\n\nJM·F says: "We\'re even."\n\nAlgram doesn\'t say thank you. But he stays, and helps JM·F close up.' },
    ],
  },

  // ── 4. 37号还在（社区结局）───────────────────────────────
  ending_37: {
    id: 'ending_37',
    speaker: null,
    textZh: '两个月后，37号便利店上了本地新闻。不是因为拆迁，而是因为一批老街坊举着"这里还有人"的牌子站在门口。',
    textEn: 'Two months later, Store No. 37 made local news — not for demolition, but because old residents stood out front with signs reading "People still here."',
    pages: [
      { textZh: 'Jenny联系到了三十几个曾经住在这条街上的人。开发商推迟了决定，等待历史建筑评估结果。', textEn: 'Jenny contacted thirty-some former residents. The developer delayed, pending a heritage assessment.' },
      { textZh: 'JM·F站在门里，看着外面的人群，眼睛红了。他打开了新一天的账本，在第一行写下：今日营业正常。', textEn: 'JM·F stood inside, watching the crowd. His eyes were red. He opened a new ledger and wrote on the first line: Business as usual today.' },
    ],
  },

  // ── 5. 重逢（情感结局）───────────────────────────────────
  ending_reunion: {
    id: 'ending_reunion',
    speaker: null,
    textZh: '天亮之前，Jenny把那封信还给JM·F，转身在门口看见了Algram——他又回来了。',
    textEn: 'Before dawn, Jenny returns the letter to JM·F and turns — Algram is at the door. He came back.',
    pages: [
      { textZh: '"你说你当年走了。"她说。\n"我现在回来了。"他说。', textEn: '"You left," she says.\n"I\'m back," he says.' },
      { textZh: '他们没有拥抱。只是并排站在玻璃门前，看着街上第一辆公交车缓缓驶过。不是和好，是重新开始可能性的第一步。', textEn: 'They don\'t embrace. They stand side by side at the glass door, watching the first bus of morning pass. Not reconciliation — the first step toward its possibility.' },
    ],
  },

  // ── 6. 父女（家庭结局）───────────────────────────────────
  ending_family: {
    id: 'ending_family',
    speaker: null,
    textZh: 'Jenny把那摞信放在收银台上，一封一封地排开。JM·F站在对面，手在抖。',
    textEn: 'Jenny lays the bundle of letters on the counter, spreading them one by one. JM·F stands across from her, hands trembling.',
    pages: [
      { textZh: '"你从来没寄过。"\n"我不知道怎么说对不起。"', textEn: '"You never sent them."\n"I didn\'t know how to say sorry."' },
      { textZh: 'Jenny哭了，不是因为原谅了他，而是因为她终于知道他也在痛。', textEn: 'Jenny cries — not because she\'s forgiven him, but because she finally knows he was hurting too.' },
      { textZh: '她走的时候，回头看了他一眼。没有说话。但她没有叫出租车——她走路回去的，走得很慢。', textEn: 'When she leaves, she turns and looks at him once. No words. But she doesn\'t call a cab — she walks home, very slowly.' },
    ],
  },

  // ── 7. 幽灵出走（超自然结局）─────────────────────────────
  ending_ghost: {
    id: 'ending_ghost',
    speaker: null,
    textZh: '凌晨三点整，ghostpixel 第一次用正常的声音说话，不再飘忽。\n\n"我在等一件事结束。今晚，结束了。"',
    textEn: 'At exactly three in the morning, the ghost speaks in a normal voice for the first time.\n\n"I was waiting for something to end. Tonight, it ended."',
    pages: [
      { textZh: '玻璃门无风自动，她走向门外，消失在光里。便利店的灯突然全部变暖。', textEn: 'The glass door opens by itself. She walks out into the light and disappears. All the store\'s lights turn warm at once.' },
      { textZh: '角落里多了一张便利贴——\n\n謝謝。\n\n繁体字。1984年的写法。', textEn: 'A sticky note appears in the corner —\n\n謝謝.\n\nTraditional characters. The 1984 way of writing it.' },
    ],
  },

  // ── 8. 新的凌晨三点（真实结局）───────────────────────────
  ending_3am: {
    id: 'ending_3am',
    speaker: null,
    textZh: '一个月后。37号便利店，凌晨三点。',
    textEn: 'One month later. Store No. 37. Three in the morning.',
    pages: [
      { textZh: 'Algram推门进来，这次不是送外卖，只是来坐一会儿。Jenny在角落里写东西。JM·F在擦货架。没有人觉得这很奇怪。', textEn: 'Algram pushes in — not delivering, just to sit a while. Jenny is writing in the corner. JM·F wipes shelves. Nobody finds this strange.' },
      { textZh: '柜台上有一颗薄荷糖，旧式包装。没有人知道是谁放的，但也没有人动它。', textEn: 'On the counter, a mint candy in an old wrapper. Nobody knows who left it. Nobody moves it.' },
      { textZh: '结账音效响起。JM·F抬头说："今晚有点忙。"\n\n没有人问他为什么笑。\n\n画面定格。', textEn: 'The register chimes. JM·F looks up. "Busy tonight."\n\nNobody asks why he\'s smiling.\n\nFade to still.' },
    ],
  },
};

export const FIRST_BEAT = 'intro_1';

/** 根据累积旗标计算最终结局 */
export function computeEnding(flags: Set<string>): string {
  // 真实结局：需要全部主线旗标
  const trueEndingFlags = ['letter_opened', 'suli_recorded', 'fangming_explained', 'aichen_honest', 'petition_signed', 'ghost_told'];
  if (trueEndingFlags.every((f) => flags.has(f))) return 'ending_3am';

  // 幽灵出走：三条人物线都连通 + ghost_told
  if (flags.has('g_shared') && flags.has('c_connected') && flags.has('h_daughter_known') && flags.has('ghost_told')) return 'ending_ghost';

  // 父女：父女相认线完整
  if (flags.has('fangming_letter') && flags.has('suli_confronted_dad') && flags.has('fangming_explained')) return 'ending_family';

  // 重逢：AlgramJenny线完整
  if (flags.has('aichen_honest') && flags.has('suli_forgave') && flags.has('letter_opened')) return 'ending_reunion';

  // 37号还在：请愿
  if (flags.has('petition_signed')) return 'ending_37';

  // 还清了：债务揭晓
  if (flags.has('fangming_benefactor') && flags.has('aichen_honest')) return 'ending_debt';

  // 档案：历史保存
  if (flags.has('archive_key') && flags.has('letter_opened') && flags.has('suli_recorded')) return 'ending_archive';

  // 默认结局
  return 'ending_lights_out';
}
