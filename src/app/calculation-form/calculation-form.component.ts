import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-calculation-form',
  templateUrl: './calculation-form.component.html',
  styleUrls: ['./calculation-form.component.css']
})
export class CalculationFormComponent implements OnInit {

  @Input("formId") formId:number;
  //character_stats
  //points
  str:number=0;
  dex:number=0;
  int:number=0;
  fth:number=0;
  hum:number=0;  
  
  hum_rat_phys_map={0:0,
    1:0.24,
    2:0.36,
    3:0.48,
    4:0.56,
    5:0.62,
    6:0.7,
    7:0.76,
    8:0.84,
    9:0.92,
   10:1};

  hum_rat_fire_map={0:0,
    1:0.24,
    2:0.36,
    3:0.48,
    4:0.56,
    5:0.62,
    6:0.7,
    7:0.78,
    8:0.86,
    9:0.94,
   10:1};
  //ratings
  str_rat:number=this.calculatePhysRating(this.str);
  dex_rat:number=this.calculatePhysRating(this.dex);
  int_rat:number=this.calculateMagRating(this.int);
  fth_rat:number=this.calculateMagRating(this.fth);
  hum_rat_phys:number=this.calculatePhysHumRating(this.hum);
  hum_rat_fire:number=this.calculateFireHumRating(this.hum);
  //weapon_stats
  //base_dmg
  phys:number=0;
  mag:number=0;
  fire:number=0;
  ligh:number=0;
  //scaling
  str_sc:number=0;
  dex_sc:number=0;
  int_sc:number=0;
  fth_sc:number=0;
  hum_sc:number=0.21;
  
   //phys bonus_damage parts:
   str_bonus:number=this.phys*this.str_sc*this.str_rat;
   dex_bonus:number=this.phys*this.dex_sc*this.dex_rat;   
   //BonusChaosPhysical = (BasePhysical + BonusStrength + BonusDexterity) × HumanityScaling × HumanityRatingPhysical
  chaos_phys_bonus:number = (this.phys+this.str_bonus+this.dex_bonus)*this.hum_sc*this.hum_rat_phys;
  //BonusChaosFire = BaseFire × HumanityScaling × HumanityRatingFire
  chaos_fire_bonus:number = this.fire*this.hum_sc*this.hum_rat_fire;
  //physical bonus_damage
  phys_bonus:number = this.str_bonus+this.dex_bonus+this.chaos_phys_bonus;
  //mag bonus_damage parts:
  int_bonus:number=this.mag*this.int_sc*this.int_rat;
  fth_bonus:number=this.mag*this.fth_sc*this.fth_rat;
  //magic bonus_damage
  mag_bonus:number = this.int_bonus+this.fth_bonus;    
  //total
  phys_total:number=this.phys+this.phys_bonus;
  mag_total:number=this.mag+this.mag_bonus;
  fire_total:number=this.fire+this.chaos_fire_bonus;  
  total=this.phys_total+this.mag_total+this.fire_total+this.ligh;

  @Output() removeRequest: EventEmitter<number> = new EventEmitter();

  constructor() {
   }

  ngOnInit() {
  }

  calculatePhysRating (points:number) {
    if (points <10 || points >99) {
      return 0;
    }    
    else {
      let ratingAmount;
      let pointsDiff;
      if (points>=40) {
        pointsDiff = points - 40;
        ratingAmount = 85+pointsDiff*0.25;
      }
      else if (points>=20) {
        pointsDiff = points - 20;
        ratingAmount = 40+pointsDiff*2.25;        
      }
      else if (points>=10) {
        pointsDiff = points - 10;
        ratingAmount = 5+pointsDiff*3.5;    
      }
      return ratingAmount/100;
    }
  }

  calculateMagRating (points:number) {
    if (points <10 || points >99) {
      return 0;
    }    
    else {
      let ratingAmount;
      let pointsDiff;
      if (points>=50) {
        pointsDiff = points - 50;
        ratingAmount = 80+pointsDiff*0.41;
      }
      else if (points>=30) {
        pointsDiff = points - 30;
        ratingAmount = 50+pointsDiff*1.50;        
      }
      else if (points>=10) {
        pointsDiff = points - 10;
        ratingAmount = 5+pointsDiff*2.25;    
      }
      return ratingAmount/100;
    }
  }

  calculatePhysHumRating(points:number) {
    if (points>10) {
      points=10;
    }
    return this.hum_rat_phys_map[points];
  }

  calculateFireHumRating (points:number) {
    if (points>10) {
      points=10;
    }
    return this.hum_rat_fire_map[points];
  }

  print() {
    console.log(JSON.stringify(this));
    
  }

  //phys damage recalculation
  recalcStrRat() {
    this.str_rat=this.calculatePhysRating(this.str);
    this.recalcBonusStr();
  }

  recalcDexRat() {
    this.dex_rat=this.calculatePhysRating(this.dex);
    this.recalcBonusDex();
  }

  recalcHumRat() {
    console.log("Reclculating humanity rating...");
    this.hum_rat_phys=this.calculatePhysHumRating(this.hum);
    this.hum_rat_fire=this.calculateFireHumRating(this.hum);
    this.recalcBonusHum();
  }

  recalcPhysBonDamage() {    
    console.log("Reclculating physical bonus damage...");
    this.phys_bonus=this.str_bonus+this.dex_bonus+this.chaos_phys_bonus;    
    this.recalcPhysTotal();
  }

  recalcFireBonDamage() {    
    console.log("Reclculating fire bonus damage...");
    console.log("---------------------BEFORE:")
    console.log("this.chaos_fire_bonus " + this.chaos_fire_bonus);    
    this.chaos_fire_bonus = this.fire*this.hum_sc*this.hum_rat_fire;
    console.log("---------------------AFTER:")
    console.log("this.chaos_fire_bonus " + this.chaos_fire_bonus);
    this.recalcFireTotal();
  }

  recalcBonusStr() {
    this.str_bonus=this.phys*this.str_sc*this.str_rat;
    this.recalcPhysBonDamage();
  }

  recalcBonusDex() {
    this.dex_bonus=this.phys*this.dex_sc*this.dex_rat;
    this.recalcPhysBonDamage();
  }

  recalcBonusHum() {
    console.log("Reclculating bonuses from humanity...");
    this.chaos_phys_bonus = (this.phys*1+this.str_bonus+this.dex_bonus)*this.hum_sc*this.hum_rat_phys;    
    //BonusChaosFire = BaseFire × HumanityScaling × HumanityRatingFire
    this.chaos_fire_bonus = this.fire*1*this.hum_sc*this.hum_rat_fire;
    this.recalcPhysBonDamage();
    this.recalcFireBonDamage();
  }

  recalcPhysTotal() {
    this.phys_total=this.phys*1 + this.phys_bonus*1;
    console.log("TOTAL PHYS: " + this.phys_total);
    this.recalcTotal();
  }

  recalcFireTotal() {
    this.fire_total=this.fire*1 + this.chaos_fire_bonus*1;
    this.recalcTotal();
  }

  updateByBasePhys() {
    this.recalcBonusStr();
    this.recalcBonusDex();  
  }

  //mag damage recalculation
  recalcIntRat() {
    this.int_rat=this.calculateMagRating(this.int);
    this.recalcBonusInt();
  }

  recalcFthRat() {
    this.fth_rat=this.calculateMagRating(this.fth);
    this.recalcBonusFth;
  }

  recalcMagBonDamage() {
    this.mag_bonus=this.int_bonus+this.fth_bonus;    
    this.recalcMagTotal();
  }

  recalcBonusInt() {
    this.int_bonus=this.mag*this.int_sc*this.int_rat;
    this.recalcMagBonDamage();
  }

  recalcBonusFth() {
    this.fth_bonus=this.mag*this.fth_sc*this.fth_rat;
    this.recalcMagBonDamage();
  }

  recalcMagTotal() {
    this.mag_total=this.mag*1 + this.mag_bonus*1;    
    this.recalcTotal();
  }

  recalcTotal() {
    this.total=this.phys_total*1+this.mag_total*1+this.fire_total*1+this.ligh*1;
  }

  updateByBaseMag() {
    this.recalcBonusInt();
    this.recalcBonusFth();  
  }

  updateByBaseFire() {
    this.recalcPhysBonDamage();
    this.recalcFireBonDamage();
  }

  removeItself() {
    console.log("My id: " + this.formId);
    this.removeRequest.emit(this.formId);
  }

}
