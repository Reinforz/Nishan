import Nishan from "../dist/Nishan";

it("Sets up default configuration for Nishan",()=>{
  const nishan = new Nishan({
    token: ""
  })
  expect(nishan.init_cache).toBe(false);
  expect(nishan.defaultExecutionState).toBe(true);
  expect(nishan.interval).toBe(500);
})

/* it("Gets the correct notion user", ()=>{
  const nishan = new Nishan({
    
  })
}) */