<script>
  import { onMount } from "svelte";
  export let dateString = null; //YYYY-MM-DD
  //import moment from "moment";
  import momentx from "moment";
  let moment;
  if (!momentx) moment = require("moment");
  else moment=momentx;
  
  
  let days = [];
  let months = [
    "",
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  let years = [];
  let monthSelected = 1;
  let yearSelected = null;
  let daySelected = 1;

  const currentYear = Number(moment().format("YYYY"));
  const adultYear = currentYear - 19;
  const maxYear = currentYear - 80;

  for (let i = adultYear; i >= maxYear; i--) {years.push(i);}
  yearSelected = years[0];
  
  

  const onChangeDate = (mode) => {
    let daysOfMonth = moment(`${yearSelected}-${monthSelected}-01`).daysInMonth();
    days = [];
    for (let i = 1; i <= daysOfMonth; i++) {days.push(i);}
    if (mode != "first"){ dateString = moment(`${yearSelected}-${monthSelected}-${daySelected}`).format("YYYY-MM-DD");} 
  };

  onMount(() => {
    onChangeDate("first");
    if (dateString && dateString.indexOf("-")) {
      let dates = dateString.split("-");
      yearSelected = Number(dates[0]);
      monthSelected = Number(dates[1]);
      daySelected = Number(dates[2]);
    } else if (dateString && dateString.indexOf("/")) {
      let dates = dateString.split("/");
      yearSelected = dates[2];
      monthSelected = dates[1];
      daySelected = dates[0];
    }
    if(!dateString) dateString = moment(`${yearSelected}-${monthSelected}-${daySelected}`).format("YYYY-MM-DD");
  });
</script>

<div class="select-date">
  <select bind:value={daySelected} on:change={onChangeDate}>
    {#each days as day}
      <option>{day}</option>
    {/each}
  </select>
  <select bind:value={monthSelected} on:change={onChangeDate}>
    {#each months as month, i (i)}
      <option value={i} disabled={i == 0}>{month}</option>
    {/each}
  </select>
  <select bind:value={yearSelected} on:change={onChangeDate}>
    {#each years as year}
      <option>{year}</option>
    {/each}
  </select>
</div>

<style>
  .select-date {
    display: grid;
    grid-template-columns: 31.5% 31% 31%;
    gap: 0.5rem;
  }
  select {
    height: 2.8em;
    border-radius: 0.4rem;
  }
</style>
