// func.js
import { storeToRefs } from "pinia";
import { dataStore } from "./store";
import { supabase } from "./supabase";
console.log('in func.js')

export async function insertplayer(player) {
  const store = dataStore();
  const { session, players } = storeToRefs(store);

  if (session.value === null) {
    players.value.push(player);
    localStorage.setItem('players', JSON.stringify(players.value));
  } else {
    const user = session.value?.user;
    console.log(user)
    const { error } = await supabase.from('player').insert({
      first_name: player.first_name,
      last_name: player.last_name,
      user_id: user?.id,
    });
    if (error) {
      throw error;
    }
  }
}


