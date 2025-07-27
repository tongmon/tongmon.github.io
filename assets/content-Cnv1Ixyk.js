const r=`# Chain of Responsibility\r
\r
책임 사슬 패턴에 대해 다룬다.  \r
마약이 불법인 국가에서 어떤 사람이 마약을 한 혐의로 붙잡혔다.  \r
처벌 받을 사람이 그 사람 한 명 뿐일까?  \r
마약을 유통한 브로커부터 제조인까지 처벌 받을 사람이 사슬처럼 연결되어 뻗어나갈 것이다.  \r
이것이 책임 사슬이다.  \r
&nbsp;\r
\r
## 포인터 사슬\r
\r
밑과 같은 생명체 클래스가 존재한다.\r
\r
\`\`\`c++\r
struct Creature\r
{\r
    std::string name;\r
    int health;\r
    int move_speed;\r
};\r
\`\`\`\r
\r
생명체에는 이름, 체력, 이동 속도 정도가 속성으로 존재한다.  \r
딱 봐도 구조체 구성이 게임을 만들 때 활용하기 좋게 생겼다.  \r
&nbsp;\r
\r
생명체 클래스를 가지고 게임이 만드는 경우 특정 상황을 생각해보자.  \r
생명체는 게임이 진행되면서 체력이 깎이기도 하며 늪지대 같은 곳을 걸어다닐 때는 이동 속도도 낮아질 것이다.  \r
이러한 이벤트들이 많이 발생될 때 차근 차근 해결해 나가기 위해 포인터 사슬 패턴을 적용해보자.  \r
&nbsp;\r
\r
먼저 밑과 같은 생명체에 영향을 주기 위한 클래스가 있다.\r
\r
\`\`\`c++\r
class CreatureModifier\r
{\r
    CreatureModifier *next;\r
\r
protected:\r
    Creature &creature;\r
\r
public:\r
    explicit CreatureModifier(Creature &creature) : creature{creature}, next{nullptr} {}\r
\r
    void add(CreatureModifier *modifier)\r
    {\r
        if (next)\r
            next->add(modifier);\r
        else\r
            next = modifier;\r
    }\r
\r
    virtual void handle()\r
    {\r
        if (next)\r
            next->handle();\r
    }\r
};\r
\`\`\`\r
\r
CreatureModifier 클래스는 연결리스트 형태를 취하고 있다.  \r
중요하게 봐야할 함수는 handle()로 handle() 함수가 한번 호출되면 사슬이 연결된 것 같이 연쇄적으로 작용한다는 것이다.  \r
CreatureModifier는 생명체 클래스를 처리하기 위한 인터페이스 역할을 해줄 것이다.  \r
&nbsp;\r
\r
생명체가 공격당하는 이벤트에 대한 클래스는 밑과 같다.\r
\r
\`\`\`c++\r
class Attacked : public CreatureModifier\r
{\r
    int damage;\r
\r
public:\r
    explicit Attacked(Creature &creature, int damage)\r
        : CreatureModifier(creature), damage{damage} {}\r
\r
    void handle()\r
    {\r
        creature.health = std::max(0, creature.health - damage);\r
        CreatureModifier::handle();\r
    }\r
};\r
\`\`\`\r
\r
특정 데미지를 생명체에게 입힐 수가 있다.  \r
중요한 점은 연쇄적 호출을 적용하기 위해 재정의한 handle() 함수에서 \`CreatureModifier::handle();\`를 호출하고 있다는 것이다.  \r
&nbsp;\r
\r
느려짐 디버프에 걸린 이벤트에 대한 클래스는 밑과 같다.\r
\r
\`\`\`c++\r
class SnailDebuff : public CreatureModifier\r
{\r
public:\r
    explicit SnailDebuff(Creature &creature) : CreatureModifier(creature) {}\r
\r
    void handle()\r
    {\r
        creature.move_speed = std::max(0, creature.move_speed - 5);\r
        CreatureModifier::handle();\r
    }\r
};\r
\`\`\`\r
\r
별거 없다.  \r
Attacked와 구조는 비슷하면서 이동속도만 감소될 뿐이다.  \r
&nbsp;\r
\r
고블린이 데미지를 입고 속도가 느려지는 상황은 밑과 같이 표현할 수 있다.\r
\r
\`\`\`c++\r
Creature goblin{"cutty", 100, 20};\r
\r
CreatureModifier goblin_modifier{goblin};\r
Attacked attacked{goblin, 40};\r
SnailDebuff snail_debuff{goblin};\r
\r
goblin_modifier.add(&attacked);\r
goblin_modifier.add(&snail_debuff);\r
\r
goblin_modifier.handle();\r
\`\`\`\r
\r
&nbsp;\r
\r
만약 데미지도 무효화하고 속도 디버프도 없애는 물약 같은 것을 고블린이 먹었다고 할 때 이 물약은 어떻게 표현할 수 있을까?  \r
밑은 물약에 대한 클래스이다.\r
\r
\`\`\`c++\r
class DrinkCanclePotion : public CreatureModifier\r
{\r
public:\r
    explicit DrinkCanclePotion(Creature &creature) : CreatureModifier(creature) {}\r
\r
    void handle() {}\r
};\r
\`\`\`\r
\r
단순히 handle() 함수에서 아무것도 안하면 된다...\r
&nbsp;\r
\r
밑과 같이 무효화 포션을 먹은 고블린은 추후에 어떠한 이벤트가 발생해도 그 효과를 받지 못한다.\r
\r
\`\`\`c++\r
Creature goblin{"cutty", 100, 20};\r
\r
CreatureModifier goblin_modifier{goblin};\r
Attacked attacked{goblin, 40};\r
SnailDebuff snail_debuff{goblin};\r
DrinkCanclePotion drink_cancle_potion{goblin};\r
\r
goblin_modifier.add(&drink_cancle_potion);\r
goblin_modifier.add(&attacked);\r
goblin_modifier.add(&snail_debuff);\r
\r
goblin_modifier.handle();\r
\`\`\`\r
\r
지금까지 본 이벤트의 순차적 처리 말고도 특정 장비(예를 들어 츄리닝 바지, 꽃 무늬 옷, 도라에몽 모자) 세트를 입는 순차적 행위를 프리셋으로 저장하여 원하는 시점에 불러 사용할 때 쓰일 수도 있다.  \r
&nbsp;\r
\r
## 브로커 사슬\r
\r
포인터 사슬의 문제점은 handle() 함수가 호출되면 원본 객체의 데이터 값을 남겨둘 수 없다는 것이다.  \r
즉 Undo가 불편해진다.  \r
브로커 사슬을 통해 이를 해결해보자.  \r
&nbsp;\r
\r
먼저 밑과 같은 쿼리 클래스가 존재한다.\r
\r
\`\`\`c++\r
struct Query {\r
    std::string name;\r
\r
    Query(const std::string &name) : name(name) {}\r
    virtual ~Query() = default;\r
};\r
\`\`\`\r
\r
해당 클래스는 특정 함수 로직이 수행되기 위해 필요한 변수들을 제공해주는 쿼리 역할을 하게 된다.  \r
멤버 변수인 name은 생명체의 이름을 나타내고 앞으로 설명할 예시에서 생명체 고유의 id 역할을 한다.  \r
가상 소멸자가 존재하는 이유는 \`dynamic_cast<>\`를 원활하게 이용하기 위해 가상 함수 테이블을 생성하기 위함이다.  \r
&nbsp;\r
\r
공격을 당하는 이벤트, 속도 감소 디버프 이벤트 등에 대한 쿼리 클래스는 밑과 같다.\r
\r
\`\`\`c++\r
struct AttackedQuery : public Query {\r
    int &health;\r
\r
    AttackedQuery(const std::string &name, int &health)\r
        : Query(name), health{health} {\r
    }\r
};\r
\r
struct SnailDebuffQuery : public Query {\r
    int &move_speed;\r
\r
    SnailDebuffQuery(const std::string &name, int &move_speed)\r
        : Query(name), move_speed{move_speed} {\r
    }\r
};\r
\`\`\`\r
\r
공격을 당하는 이벤트에는 생명체의 체력이, 속도 감소 디버프는 이동 속도에 대한 정보가 필요하다.  \r
참조를 멤버 변수로 사용하는 이유는 동일한 변수를 여러 개의 쿼리가 복합적으로 다루는 경우가 있기 때문이다.  \r
예를 들어 공격을 당해 체력이 깎이는 것과 회복 물약을 먹어 체력이 회복되는 것은 체력이라는 동일한 변수를 다루게 된다.  \r
&nbsp;\r
\r
밑은 함수를 리스트 형태로 저장하고 있는 Game 클래스이다.\r
\r
\`\`\`c++\r
struct Game\r
{\r
    std::list<std::function<void(Query &)>> queries;\r
};\r
\`\`\`\r
\r
이 클래스가 브로커 패턴의 핵심인 매개자이다.  \r
&nbsp;\r
\r
밑은 생명체 클래스이다.\r
\r
\`\`\`c++\r
class Creature {\r
    Game &game;\r
    int health;\r
    int move_speed;\r
\r
   public:\r
    std::string name;\r
\r
    Creature(Game &game, const std::string &name, const int &health, const int &move_speed)\r
        : game(game),\r
          health(health),\r
          move_speed(move_speed),\r
          name(name) {\r
    }\r
\r
    int get_health() {\r
        int health = this->health;\r
        AttackedQuery q{name, health};\r
        for (const auto &func : game.queries)\r
            func(q);\r
        return health;\r
    }\r
\r
    int get_speed() {\r
        int move_speed = this->move_speed;\r
        SnailDebuffQuery q{name, move_speed};\r
        for (const auto &func : game.queries)\r
            func(q);\r
        return move_speed;\r
    }\r
};\r
\`\`\`\r
\r
get_health(), get_speed() 함수에서 전에 정의해놓은 쿼리들을 사용하는 모습을 볼 수 있다.  \r
쿼리에 생명체의 멤버 변수를 복사하여 옮겨 담고 함수 리스트의 함수들을 실행하면서 쿼리의 멤버 변수를 바꾸기 때문에 생명체 객체의 원본을 유지할 수 있다.  \r
&nbsp;\r
\r
밑은 생명체 변경 작업을 담당하는 클래스이다.\r
\r
\`\`\`c++\r
class CreatureModifier {\r
   protected:\r
    Game &game;\r
    Creature &creature;\r
\r
   public:\r
    virtual ~CreatureModifier() = default;\r
\r
    CreatureModifier(Game &game, Creature &creature)\r
        : game(game),\r
          creature(creature) {\r
    }\r
};\r
\`\`\`\r
\r
별로 특이한 점은 없고 Game, Creature 클래스의 사용을 생성자를 통해 강제하기 위해 존재한다.  \r
&nbsp;\r
\r
밑은 공격 받는 이벤트를 처리하기 위한 클래스이다.\r
\r
\`\`\`c++\r
class AttackedModifier : public CreatureModifier {\r
    std::list<std::function<void(Query &)>>::iterator iter;\r
\r
   public:\r
    AttackedModifier(Game &game, Creature &creature, const int &damage)\r
        : CreatureModifier(game, creature) {\r
        iter = game.queries.insert(game.queries.end(), [&](Query &q) {\r
            AttackedQuery *aq = dynamic_cast<AttackedQuery *>(&q);\r
            if (aq && creature.name == aq->name)\r
                aq->health = std::max(0, aq->health - damage);\r
        });\r
    }\r
\r
    ~AttackedModifier() {\r
        game.queries.erase(iter);\r
    }\r
};\r
\`\`\`\r
\r
AttackedQuery를 이용하여 체력을 감소 시키는 로직이 담긴 람다 함수를 queries에 담고 있다.  \r
AttackedModifier의 소멸자를 보면 queries에서 삽입했던 람다 함수를 지워주고 있는데 이러한 특성을 통해 AttackedModifier의 선언 시점에 따라 소멸되면서 원본 Creature 객체를 유지할 수 있다.  \r
&nbsp;\r
\r
이동 속도 감소 클래스는 밑과 같다.\r
\r
\`\`\`c++\r
class SnailDebuffModifier : public CreatureModifier {\r
    std::list<std::function<void(Query &)>>::iterator iter;\r
\r
   public:\r
    SnailDebuffModifier(Game &game, Creature &creature)\r
        : CreatureModifier(game, creature) {\r
        iter = game.queries.insert(game.queries.end(), [&](Query &q) {\r
            SnailDebuffQuery *sq = dynamic_cast<SnailDebuffQuery *>(&q);\r
            if (sq && creature.name == sq->name)\r
                sq->move_speed = std::max(0, sq->move_speed - 5);\r
        });\r
    }\r
\r
    ~SnailDebuffModifier() {\r
        game.queries.erase(iter);\r
    }\r
};\r
\`\`\`\r
\r
&nbsp;\r
\r
밑은 사용 예시이다.\r
\r
\`\`\`c++\r
Game game;\r
Creature goblin{game, "cutty", 100, 20};\r
std::cout << goblin.get_health() << " " << goblin.get_speed() << "\\n";\r
\r
{\r
    AttackedModifier am{game, goblin, 10};\r
    std::cout << goblin.get_health() << " " << goblin.get_speed() << "\\n";\r
}\r
\r
SnailDebuffModifier sm{game, goblin};\r
std::cout << goblin.get_health() << " " << goblin.get_speed() << "\\n";\r
\`\`\`\r
\r
처음 고블린은 아무런 영향을 받지 않으므로 [체력: 100, 이동 속도: 20]인 상태이다.  \r
블록 내부에서는 공격을 받아 [체력: 100, 이동 속도: 20]이다.  \r
마지막에는 블록을 벗어나고 속도 감소 디버프를 받아 [체력: 100, 이동 속도: 15]인 상태이다.  \r
&nbsp;\r
\r
### Boost.Signals2\r
\r
Game 클래스의 \`std::list<std::function<void(Query &)>> queries;\` 부분을 Boost.Signals2 함수로 교체할 수 있다.  \r
Boost.Signals2로 교체한 모습은 밑과 같다.\r
\r
\`\`\`c++\r
struct Game {\r
    boost::signals2::signal<void(Query &)> queries;\r
};\r
\r
class Creature {\r
    Game &game;\r
    int health;\r
    int move_speed;\r
\r
   public:\r
    std::string name;\r
\r
    Creature(Game &game, const std::string &name, const int &health, const int &move_speed)\r
        : game(game),\r
          health(health),\r
          move_speed(move_speed),\r
          name(name) {\r
    }\r
\r
    int get_health() {\r
        int health = this->health;\r
        AttackedQuery q{name, health};\r
        game.queries(q);\r
        return health;\r
    }\r
\r
    int get_speed() {\r
        int move_speed = this->move_speed;\r
        SnailDebuffQuery q{name, move_speed};\r
        game.queries(q);\r
        return move_speed;\r
    }\r
};\r
\r
class AttackedModifier : public CreatureModifier {\r
    boost::signals2::connection conn;\r
\r
   public:\r
    AttackedModifier(Game &game, Creature &creature, const int &damage)\r
        : CreatureModifier(game, creature) {\r
        conn = game.queries.connect([&](Query &q) {\r
            AttackedQuery *aq = dynamic_cast<AttackedQuery *>(&q);\r
            if (aq && creature.name == aq->name)\r
                aq->health = std::max(0, aq->health - damage);\r
        });\r
    }\r
\r
    ~AttackedModifier() {\r
        conn.disconnect();\r
    }\r
};\r
\r
class SnailDebuffModifier : public CreatureModifier {\r
    boost::signals2::connection conn;\r
\r
   public:\r
    SnailDebuffModifier(Game &game, Creature &creature)\r
        : CreatureModifier(game, creature) {\r
        conn = game.queries.connect([&](Query &q) {\r
            SnailDebuffQuery *sq = dynamic_cast<SnailDebuffQuery *>(&q);\r
            if (sq && creature.name == sq->name)\r
                sq->move_speed = std::max(0, sq->move_speed - 5);\r
        });\r
    }\r
\r
    ~SnailDebuffModifier() {\r
        conn.disconnect();\r
    }\r
};\r
\`\`\`\r
\r
Boost.Signals2도 내부적으로 함수 리스트를 순회하면서 함수들을 작동시킨다.  \r
Boost.Signals2은 thread-safe 하기에 별도의 lock 관련 로직을 구현해주지 않아도 된다는 장점이 있다.  \r
&nbsp;\r
\r
## 요약\r
\r
1. 책임 사슬 패턴은 명령, 조회 작업을 순차적으로 처리하기에 유용하다.\r
\r
2. 포인터를 이용해 간단한 구조의 책임 사슬 패턴을 구성할 수 있다.\r
\r
3. 브로커를 이용한 사슬 구현은 원본 객체를 유지하면서 변경점을 적용할 수 있다는 장점이 있다.\r
`;export{r as default};
