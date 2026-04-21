<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('administrators')->insertOrIgnore([
            ['id' => 1, 'username' => 'admin1', 'password' => Hash::make('hellouniverse1!'), 'last_login_at' => null, 'created_at' => '2024-04-05 13:55:40', 'updated_at' => '2024-04-05 13:55:40'],
            ['id' => 2, 'username' => 'admin2', 'password' => Hash::make('hellouniverse2!'), 'last_login_at' => null, 'created_at' => '2024-04-05 15:27:52', 'updated_at' => '2024-04-05 15:27:52'],
        ]);

        foreach ([
            [1,'player1','helloworld1!','2024-04-05 13:55:40'],
            [2,'player2','helloworld2!','2024-04-05 13:55:40'],
            [3,'dev1','hellobyte1!','2024-04-05 13:55:40'],
            [4,'dev2','hellobyte2!','2024-04-05 13:55:40'],
            [5,'player3','helloworld3!','2024-04-05 13:55:40'],
            [6,'player4','helloworld4!','2024-04-05 13:55:40'],
            [7,'player5','helloworld5!','2024-04-05 13:55:40'],
            [8,'player6','helloworld6!','2024-04-05 13:55:40'],
            [9,'player7','helloworld7!','2024-04-05 13:55:40'],
            [10,'player8','helloworld8!','2024-04-05 13:55:40'],
        ] as [$id,$username,$password,$ts]) {
            DB::table('users')->insertOrIgnore(['id'=>$id,'username'=>$username,'password'=>Hash::make($password),'last_login_at'=>null,'delete_reason'=>null,'created_at'=>$ts,'updated_at'=>$ts,'deleted_at'=>null]);
        }

        foreach ([
            [1,'Demo Game 1','demo-game-1','This is demo game 1',3,'2024-04-09 15:32:41'],
            [2,'Demo Game 2','demo-game-2','This is demo game 2',3,'2024-04-09 16:50:36'],
            [3,'Demo Game 3','demo-game-3','This is demo game 3',3,'2024-04-09 16:45:29'],
            [4,'Demo Game 4','demo-game-4','This is demo game 4',3,'2024-04-09 17:43:25'],
            [5,'Demo Game 5','demo-game-5','This is demo game 5',3,'2024-04-09 17:41:21'],
            [6,'Demo Game 6','demo-game-6','This is demo game 6',3,'2024-04-09 17:39:17'],
            [7,'Demo Game 7','demo-game-7','This is demo game 7',3,'2024-04-09 17:37:13'],
            [8,'Demo Game 8','demo-game-8','This is demo game 8',3,'2024-04-09 18:35:09'],
            [9,'Demo Game 9','demo-game-9','This is demo game 9',3,'2024-04-09 18:33:05'],
            [10,'Demo Game 10','demo-game-10','This is demo game 10',3,'2024-04-09 18:31:01'],
            [11,'Demo Game 11','demo-game-11','This is demo game 11',3,'2024-04-09 18:28:57'],
            [12,'Demo Game 12','demo-game-12','This is demo game 12',3,'2024-04-09 19:26:53'],
            [13,'Demo Game 13','demo-game-13','This is demo game 13',3,'2024-04-09 19:24:49'],
            [14,'Demo Game 14','demo-game-14','This is demo game 14',3,'2024-04-09 19:22:45'],
            [15,'Demo Game 15','demo-game-15','This is demo game 15',3,'2024-04-09 19:20:41'],
            [16,'Demo Game 16','demo-game-16','This is demo game 16',4,'2024-04-09 20:18:37'],
            [17,'Demo Game 17','demo-game-17','This is demo game 17',4,'2024-04-09 20:16:33'],
            [18,'Demo Game 18','demo-game-18','This is demo game 18',4,'2024-04-09 20:14:29'],
            [19,'Demo Game 19','demo-game-19','This is demo game 19',4,'2024-04-09 20:12:25'],
            [20,'Demo Game 20','demo-game-20','This is demo game 20',4,'2024-04-09 21:10:21'],
            [21,'Demo Game 21','demo-game-21','This is demo game 21',4,'2024-04-09 21:08:17'],
            [22,'Demo Game 22','demo-game-22','This is demo game 22',4,'2024-04-09 21:06:13'],
            [23,'Demo Game 23','demo-game-23','This is demo game 23',4,'2024-04-09 21:04:09'],
            [24,'Demo Game 24','demo-game-24','This is demo game 24',4,'2024-04-09 22:02:05'],
            [25,'Demo Game 25','demo-game-25','This is demo game 25',4,'2024-04-09 22:00:01'],
            [26,'Demo Game 26','demo-game-26','This is demo game 26',4,'2024-04-09 21:57:57'],
            [27,'Demo Game 27','demo-game-27','This is demo game 27',4,'2024-04-09 21:55:53'],
            [28,'Demo Game 28','demo-game-28','This is demo game 28',4,'2024-04-09 22:53:49'],
            [29,'Demo Game 29','demo-game-29','This is demo game 29',4,'2024-04-09 22:51:45'],
            [30,'Demo Game 30','demo-game-30','This is demo game 30',4,'2024-04-09 22:49:41'],
        ] as [$id,$title,$slug,$description,$createdBy,$ts]) {
            DB::table('games')->insertOrIgnore(['id'=>$id,'title'=>$title,'slug'=>$slug,'description'=>$description,'created_by'=>$createdBy,'created_at'=>$ts,'updated_at'=>$ts,'deleted_at'=>null]);
        }

        for ($i = 1; $i <= 30; $i++) {
            DB::table('game_versions')->insertOrIgnore(['id'=>$i,'game_id'=>$i,'version'=>1,'storage_path'=>"games/demo-game-{$i}/1",'created_at'=>'2024-04-09 15:32:41','updated_at'=>'2024-04-09 15:32:41']);
        }

        foreach ([
            [1,1,1,10.00,'2024-04-09 15:35:41'],
            [2,1,1,15.00,'2024-04-09 15:36:41'],
            [3,1,2,12.00,'2024-04-09 15:54:27'],
            [4,2,2,20.00,'2024-04-09 15:55:39'],
            [5,2,3,30.00,'2024-04-09 16:53:41'],
            [6,3,2,1000.00,'2024-04-09 16:53:41'],
            [7,3,2,-300.00,'2024-04-09 16:54:41'],
            [8,4,2,5.00,'2024-04-09 16:56:41'],
            [9,4,3,200.00,'2024-04-09 16:57:41'],
            [10,5,4,135.00,'2024-04-09 16:45:38'],
        ] as [$id,$userId,$gvId,$score,$ts]) {
            DB::table('scores')->insertOrIgnore(['id'=>$id,'user_id'=>$userId,'game_version_id'=>$gvId,'score'=>$score,'created_at'=>$ts,'updated_at'=>$ts]);
        }
    }
}
