import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CalendarIcon } from "lucide-react";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { SaleTransaction } from "./SalesTable";

const editSaleSchema = z.object({
  tipo_ativo: z.string().min(1, "Tipo de ativo é obrigatório"),
  ativo: z.string().min(1, "Ativo é obrigatório"),
  data: z.date({
    required_error: "Data é obrigatória",
  }),
  quantidade: z.number().min(1, "Quantidade deve ser maior que 0"),
  preco: z.number().min(0.01, "Preço deve ser maior que 0"),
  corretagem: z.number().min(0, "Corretagem deve ser maior ou igual a 0"),
});

type EditSaleFormData = z.infer<typeof editSaleSchema>;

interface EditSaleFormProps {
  sale: SaleTransaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: EditSaleFormData & { valor_total: number }) => void;
}

export function EditSaleForm({ sale, open, onOpenChange, onSubmit }: EditSaleFormProps) {
  const { toast } = useToast();

  const form = useForm<EditSaleFormData>({
    resolver: zodResolver(editSaleSchema),
    defaultValues: {
      tipo_ativo: "",
      ativo: "",
      quantidade: 0,
      preco: 0,
      corretagem: 0,
    },
  });

  useEffect(() => {
    if (sale && open) {
      form.reset({
        tipo_ativo: sale.tipo_ativo,
        ativo: sale.ativo,
        data: parseISO(sale.data),
        quantidade: sale.quantidade,
        preco: sale.preco,
        corretagem: sale.corretagem,
      });
    }
  }, [sale, open, form]);

  const handleSubmit = (data: EditSaleFormData) => {
    const valor_total = (data.quantidade * data.preco) - data.corretagem;
    
    onSubmit({
      ...data,
      valor_total,
    });

    toast({
      title: "Venda atualizada",
      description: "A venda foi atualizada com sucesso!",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Venda</DialogTitle>
          <DialogDescription>
            Edite os dados da venda selecionada
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tipo_ativo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Ativo</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="acoes">Ações</SelectItem>
                      <SelectItem value="fundos_imobiliarios">Fundos Imobiliários</SelectItem>
                      <SelectItem value="renda_fixa">Renda Fixa</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ativo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ativo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: BBAS3, MXRF11" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data da Venda</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Selecione a data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date > new Date()}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="preco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="corretagem"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Corretagem (R$)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Alterações
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}